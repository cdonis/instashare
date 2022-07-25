import React from 'react';
import { message, Modal, Upload, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'umi';

import { request } from '../../../app';
import '@/instashare.less';
import { handleCatchErrorForm } from '@/utils/utils';

type UploadFileFormProps = {
  close: (success?: boolean) => void;
  visible: boolean;
};

const { Dragger } = Upload;

const UploadFileForm: React.FC<UploadFileFormProps> = ({visible, close}) => {
    
  const draggerProps: UploadProps = {
    name: 'file',
    action: `${request.prefix}/api/admin/files`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    showUploadList: {
        showRemoveIcon: false,
    },
    onChange({file, fileList, event}) {
      if (file.status === 'done') {
        message.success(`${file.name} file uploaded successfully`);
        close(true);
      } else if (file.status === 'error') {
        handleCatchErrorForm({data: file.response});
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Modal
        title={<FormattedMessage id={"uploadform.page_title"} defaultMessage="Upload new file"/>}
        visible={visible}
        className="instashare-ant-modal"
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        onCancel={() => close(false)}
    >
        <>
        <div className="file-select">
            <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text"><FormattedMessage id={"uploadform.upload_text"}/></p>
                <p className="ant-upload-hint"><FormattedMessage id={"uploadform.upload_hint1"}/></p>
                <p className="ant-upload-hint"><FormattedMessage id={"uploadform.upload_hint2"}/></p>
            </Dragger>
        </div>
        </>
    </Modal>
  );
};

export default UploadFileForm;
