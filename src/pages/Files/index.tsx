import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage, useAccess, Access, useModel, dynamic } from 'umi';
import { Alert, Button, Modal, Progress } from 'antd';

import { DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { defaultActionRender } from '@ant-design/pro-utils/lib/useEditableArray';
import { PageContainer } from '@ant-design/pro-layout';
import LoadingComponent  from '@ant-design/pro-layout/lib/PageLoading';
import ProTable, { ProColumns, ActionType, ColumnsState } from '@ant-design/pro-table';

import { getFilesList } from '@/services/instashare/files';

import { handleDownload, handleRemove, handleUpdate } from './utils';
import { getColumnSearchProps } from '@/utils/forTables';
import { formatDate } from '@/utils/utils';
import './index.less';

const UPLOAD_FILE_FORM = "UploadFileForm";
const UploadFileForm = dynamic( {
    loader: () => import(/* webpackChunkName: '[request]' */ `./components/${UPLOAD_FILE_FORM}`),
    loading: LoadingComponent,
})

const Files: React.FC<any> = () => {

  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>();
  const [showUploadFileForm, setShowUploadFileForm] = useState<boolean>(false);

  const { initialState } = useModel('@@initialState');
  const access = useAccess();

  /** i18n */
  const intl = useIntl();

  /** Columns definitions */
  const columns: ProColumns<API.File>[] = [
    { title: intl.formatMessage({id: 'filesPage.column_filename'}),
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Required value',
          },
          {
            pattern: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,_\s-]+$/,
            message: 'Just letters, numbers and ".", "-", "_"',
          },
          {
            max: 255,
            message: 'No more than 255 characters',
          },
        ],
      },
    },
    {   title: intl.formatMessage({id: 'filesPage.column_size'}),
        dataIndex: 'size',
        sorter: true,
        editable: false,
        align: 'right',
        render: (dom, entity) => {
            return (entity.size) ? `${Math.floor(entity?.size / 1024)} KiB` : '';
        }
    },
    {   title: intl.formatMessage({id: 'filesPage.column_md5'}),
        dataIndex: 'md5',
        editable: false,
    },
    {   title: intl.formatMessage({id: 'filesPage.column_status'}),
        dataIndex: 'status',
        editable: false,
        render: (dom, entity) => {
            let percent = 33;   // Because LOADED
            switch (entity?.status) {
                case 'STORED': percent = 67; break
                case 'ZIPPED': percent = 100; break
            }
            return <Progress percent={percent} strokeWidth={10} steps={3} />
        }
    },
    {   title: intl.formatMessage({id: 'filesPage.column_uploaded'}),
        dataIndex: 'created_at',
        sorter: true,
        editable: false,
        align: 'center',
        ...getColumnSearchProps(undefined, 'DATE'),
        render: (dom, entity) => (entity.created_at) ? formatDate(entity.created_at || "", "DD/MM/YYYY h:i:s") : dom,
    },
    {   title: intl.formatMessage({id: 'filesPage.column_lastupdate'}),
        dataIndex: 'updated_at',
        sorter: true,
        editable: false,
        align: 'center',
        ...getColumnSearchProps(undefined, 'DATE'),
        render: (dom, entity) => (entity.updated_at) ? formatDate(entity.updated_at || "", "DD/MM/YYYY h:i:s") : dom,
    },
    {   title: intl.formatMessage({id: 'common.options'}),
        dataIndex: 'option',
        valueType: 'option',
        width: 100,
        render: (text, record, _, action) => {
            let options: any[] = [];
                // Edit and delete allowed for files owners
                if (record.user_id === initialState?.currentUser?.id) {
                    options.push(
                        <a  key="editable" title='Edit' onClick={() => record.id && action?.startEditable?.(record.id)}>
                            <EditOutlined />
                        </a>,
                    );
                    options.push(
                        <a  key="delete" title='Delete'
                            onClick = { async () => {
                                Modal.confirm({
                                    title: `Do yo want to delete the file "${record.name ||''}"?`,
                                    icon: <ExclamationCircleOutlined />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk: async () => {
                                        const success = await handleRemove(record.id || -1);
                                        if (success) {
                                            actionRef.current?.reloadAndRest?.();
                                        }
                                    }
                                })
                            }}
                        >
                            <DeleteOutlined />
                        </a>,
                    );
                }
                if (record.status === 'ZIPPED') {
                    options.push(
                        <a  key="download" title="Download" 
                            onClick={async () => record.id && handleDownload(record.id, `${record.name}.zip`)}
                        >
                            <DownloadOutlined />
                        </a>,
                    );
                }

            return options;
        },
    },
  ];

  const editableConfiguration: any = {
    type: 'single',
    editableKeys,
    onSave: async (rowKey: string|number, data: any) => {
      delete data.index;                                  // Remove added propertie "index"
      await handleUpdate(rowKey as number, data as API.File);
      actionRef.current && actionRef.current.reload();
    },
    onChange: setEditableRowKeys,
    actionRender: (row: any, config: any) => {
      const configLocal = { ...config };
      configLocal.cancelText = intl.formatMessage({id: 'common.cancel', defaultMessage: 'Cancel'});
      configLocal.saveText = intl.formatMessage({id: 'common.accept', defaultMessage: 'Accept'});
      return defaultActionRender(row, configLocal).filter((value) => {
        return value?.key !== 'delete';
      });
    },
    //deletePopconfirmMessage: 'Remove file?',
    onlyOneLineEditorAlertMessage:
      'Only one row can be edited at a time. Complete or cancel current edition.',
    // onlyAddOneLineAlertMessage: 'Solo puede ser adicionado un elemento a la vez. Complete o cancele la creación del elemento en proceso.',
  };

  const getToolBarActions = () => {
    let buttons: any[] = [];
    if (access.canUploadFiles)
        buttons.push(
            <Button
                title="Upload new file"
                type="primary"
                key="primary"
                onClick={() => setShowUploadFileForm(true)}
            >
                    <UploadOutlined />{' '}
                    <FormattedMessage id="common.upload" defaultMessage="Upload file" />
            </Button>,
        );

    return buttons;
  };

  return (
    <PageContainer
        className='files-page-header'
        header={{
          title: intl.formatMessage({id: 'filesPage.page_title', defaultMessage: 'Files from the community'}),
          breadcrumb: {},
        }}
    >
        <Access 
            accessible={access.canListFiles || false}
            fallback={<Alert type="error" showIcon banner 
                message={intl.formatMessage({id: 'filesPage.list_access_denied'})}
            />}
        >
            <ProTable<API.File, API.PageParams>
                className="instashare-pro-table"
                actionRef={actionRef}
                rowKey="id"
                search={false}
                editable={editableConfiguration}
                request={(params, sort, filter) => getFilesList({ params, sort, filter })}
                columns={columns}
                toolbar={{
                    search: {
                        placeholder: intl.formatMessage({id: 'filesPage.search_placeholder'}),
                        allowClear: true,
                        width: '100%',
                    },
                    actions: getToolBarActions(),
                }}
                options={{
                    density: true,
                    fullScreen: true,
                    setting: false,
                    search: true,
                }}
                columnsStateMap={columnsStateMap}
                onColumnsStateChange={setColumnsStateMap}
                pagination={{
                    pageSize: 5,
                    pageSizeOptions: ['5', '10', '20', '100'],
                }}
                scroll={{ x: 'max-content' }}
            />
            { showUploadFileForm &&
                <UploadFileForm
                    visible={showUploadFileForm}
                    close={(success?: boolean) => {
                        setShowUploadFileForm(false);
                        if (success && actionRef.current) actionRef.current.reload();
                    }} 
                />
            }
        </Access>
    </PageContainer>
  )
};

export default Files;
