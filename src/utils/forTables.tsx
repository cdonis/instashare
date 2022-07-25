import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
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
        id: 'common.search_in',
        defaultMessage: 'Search in',
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
  const dateFormat = 'DD-MM-YYYY HH:mm:ss';
  const _value: [any, any] | undefined = (value.length > 1) ? [moment(value[0], "DD-MM-YYYY HH:mm:ss"), moment(value[1], "DD-MM-YYYY HH:mm:ss")] : undefined;
  return (
    <RangePicker format={dateFormat} value={_value} showTime
      ranges={{
        'Today': [moment(), moment()],
        'Current month': [moment().startOf('month'), moment().endOf('month')],
        'Current quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
        'Current year': [moment().startOf('year'), moment().endOf('year')]
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
          id: 'common.filter',
          defaultMessage: 'Filter',
        })}
      </Button>
      <Button size="small" style={{ width: 95 }} onClick={() => onResetFilter()}>
        {intl.formatMessage({
          id: 'common.reset',
          defaultMessage: 'Reset',
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
    <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value: any, record: any) => true,
});