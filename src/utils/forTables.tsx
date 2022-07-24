import { SearchOutlined } from "@ant-design/icons";
import ProTable, { ColumnsState } from "@ant-design/pro-table";
import { DatePicker, Button, Input, Space } from "antd";
import moment from "moment";
import { useIntl } from "umi";

const { RangePicker } = DatePicker;

const TextFilter = ({label, value, onChange, onPressEnter}: {
  label: string; 
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onPressEnter: () => void;
}) => {
  const intl = useIntl();
  return (
    <Input
      placeholder={`${intl.formatMessage({
        id: 'admin.pages.users.searchInPlaceholder',
        defaultMessage: 'Buscar en',
      })} "${label}"`}
      value={value}
      onChange={onChange}
      onPressEnter={onPressEnter}
      style={{ marginBottom: 10, display: 'flex' }}
    />
  )
}

const DateFilter = ({value, onChange}: {
  value: any[];
  onChange: (values: string[]) => void;
}) => {
  const dateFormat = 'DD-MM-YYYY';
  const _value: [any, any] | undefined = (value.length > 1) ? [moment(value[0], "DD-MM-YYYY"), moment(value[1], "DD-MM-YYYY")] : undefined;
  return (
    <RangePicker format={dateFormat} value={_value}
      ranges={{
        'Hoy': [moment(), moment()],
        'Mes actual': [moment().startOf('month'), moment().endOf('month')],
        'Trimestre actual': [moment().startOf('quarter'), moment().endOf('quarter')],
        'Año actual': [moment().startOf('year'), moment().endOf('year')]
      }}
      onChange={(_, formatedRange) => onChange(formatedRange)} 
      style={{ marginBottom: 10, display: 'flex' }}
    />
  )
}

const Actions = ({onSearch, onResetFilter}: {
  onSearch: () => void;
  onResetFilter: () => void;
}) => {
  const intl = useIntl();
  return (
    <Space style={{width: '100%', justifyContent: 'center'}}>
      <Button type="primary" icon={<SearchOutlined />} size="small" style={{ width: 95 }} onClick={ () => onSearch() }>
        {intl.formatMessage({
          id: 'admin.pages.users.inColumnSearchButton',
          defaultMessage: 'Filtrar',
        })}
      </Button>
      <Button size="small" style={{ width: 95 }} onClick={() => onResetFilter()}>
        {intl.formatMessage({
          id: 'admin.pages.users.inColumnResetSearchButton',
          defaultMessage: 'Resetear',
        })}
      </Button>
    </Space>    
  )
}

export const getColumnSearchProps = (
  label?: string,
  type: 'TEXT'|'DATE' = 'TEXT'
) => ({
  filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }: {
    setSelectedKeys: any;
    selectedKeys: any;
    confirm: any;
    clearFilters: any;
  }) => (
    <div style={{ padding: 8 }}>
      { (type && type === 'TEXT')
          ? <TextFilter label={label || ""} value={selectedKeys[0]}
              onChange={ (e) => setSelectedKeys(e.target.value ? [e.target.value] : []) }
              onPressEnter={() => confirm()}
            />
          : <DateFilter value={selectedKeys}
              onChange={(range) => setSelectedKeys(range ? range : [])}
            />
      }
      <Actions 
        onSearch={() => confirm()}
        onResetFilter={() => clearFilters()}
      />
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value: any, record: any) => true,
});

export const formatNumber = (
  number: number | bigint | undefined, 
  precision: number
): string => (number !== undefined && number !== null) 
    ? new Intl.NumberFormat("en-us", {style: 'decimal', useGrouping: true, minimumFractionDigits: precision}).format(number)
    : "-"

/**
 * Permite obtener una fila resumen con el total de las columnas especificadas en "toSummarize"
 * Se admite especificar la función de callback "getLabel" para obtener la etiqueta final a presentar en caso de que
 * se le desee atribuir un formato específico.
 * !!! Requiere que columnsState se inicialize incluyendo todas las posibles columnas a presentar en la tabla
 */
export const getSummaryRow = ({dataSet, toSummarize, columnsState, getLabel}: {
  dataSet: readonly Record<string,any>[];       // Conjunto de datos actual de la tabla
  toSummarize: string[];                        // Nombre de las columnas a sumarizar
  columnsState: Record<string, ColumnsState>;   // Estado de configuración de las columnas de la tabla
  getLabel?: (value: number) => string;         // Callback para obtener el label final a presentar
}) => {
  {
    // Inicializar los totalizadores y las etiquetas a mostrar de cada columna a sumarizar
    let totals: Record<string, number> = {};
    let labels: Record<string, string> = {};
    toSummarize.forEach(col => { totals[col] = 0, labels[col] = ""});
    
    //Obtener el total de cada columna a partir de los valores del dataset 
    dataSet.forEach((record) => toSummarize.forEach(column => totals[column] += (record[column] || 0.00) * 1));

    // Obtener la etiqueta final a mostrar a partir de los totales y utilizando el callback getLabel()
    toSummarize.forEach(column => labels[column] = (getLabel) ? getLabel(totals[column]) : `${totals[column]}`);
    
    // Obtener arreglo con las columnas ordenado según el campo "order"
    const orderedColumns: (ColumnsState & {name: string})[] = Object.keys(columnsState).map((column) => ({
      name: column,
      ...columnsState[column]
    })).sort((a,b) => {
      const element1: number = (a.order !== undefined) ? a.order : 500;
      const element2: number = (b.order !== undefined) ? b.order : 500;
      return (element1 - element2);
    });
    
    return (
      <ProTable.Summary>
        <ProTable.Summary.Row style={{background: '#fafafa'}}>
          {orderedColumns.map((column, index) => (column.show !== undefined && column.show === false)  // Si existe el atributo "show", su valor es "false"
            ? undefined
            : (labels[column.name])
              ? <ProTable.Summary.Cell key={column.name} index={index} align="right"><strong>{labels[column.name]}</strong></ProTable.Summary.Cell>
              : <ProTable.Summary.Cell key={column.name} index={index}/>
          )}
        </ProTable.Summary.Row>
      </ProTable.Summary>
    )
  }
}