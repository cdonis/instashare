import { downloadFile, removeFile, updateFile } from '@/services/instashare/files';
import { handleCatchErrorForm, downloadFileTrait } from '@/utils/utils';
import { message } from 'antd';

/**
 * Download file
 *
 * @param id File ID
 */
 export const handleDownload = async (id: number, filename: string) => {
    const hide = message.loading('Please wait while downloading the file ...');
    try {
      downloadFile({id}, {responseType: 'blob', getResponse: true})
        .then( (response) => {
            downloadFileTrait(response, filename)
            hide();
        });
      return true;
    } catch (error: any) {
      hide();
      handleCatchErrorForm(error);
      return false;
    }
  };

/**
 * Update file's metadata
 *
 * @param id
 * @param data File's metadata, basically the name of the file
 */
export const handleUpdate = async (id: number, data: Partial<API.File>) => {
    console.log('ID', id);
    console.log('data', data);
  const hide = message.loading(`Updating file's metadata`);
  try {
    await updateFile({id}, data);
    hide();
    message.success("File's metadata successfull updated.");
    return true;
  } catch (error: any) {
    hide();
    handleCatchErrorForm(error);
    return false;
  }
};

/**
 * Remove file
 *
 * @param id File ID
 */
export const handleRemove = async (id: number) => {
    const hide = message.loading(`Unlinking the file`);
    try {
      await removeFile({ id });
      hide();
      message.success(`File was succesfull unlinked.`);
      return true;
    } catch (error) {
      hide();
      handleCatchErrorForm(error);
      return false;
    }
};