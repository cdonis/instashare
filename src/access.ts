/**
 * Plugin-access
 */

export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const a = {
    canUploadFiles: currentUser?.name !== undefined,
    canListFiles: currentUser?.name !== undefined,
  };

  return a;
}
