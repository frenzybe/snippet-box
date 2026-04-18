import { useState, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { LibrarySection } from './Sidebar/sections/LibrarySection';
import { FolderSection } from './Sidebar/sections/FolderSection';
import { LanguageSection } from './Sidebar/sections/LanguageSection';
import { SnippetListSection } from './Sidebar/sections/SnippetListSection';
import { BulkActionsToolbar } from './ui/BulkActionsToolbar';
import { ConfirmModal } from './ui/ConfirmModal';
import { FolderModal } from './FolderModal';
import { FolderPicker } from './FolderPicker';

import { useSnippetStore, selectLanguages, selectCounts } from '../store/useSnippetStore';
import { useFolderStore } from '../store/useFolderStore';
import { useSidebarLogic } from '../hooks/useSidebarLogic';
import { useToastStore } from '../store/useToastStore';
import { useLocale } from '../context/LocaleContext';
import { Folder } from '../types';
import styles from './Sidebar/Sidebar.module.css';

export function Sidebar() {
  const { t } = useLocale();
  const addToast = useToastStore(state => state.addToast);

  const {
    sortedSnippets,
    handleSnippetClick,
    selectedId,
    activeCollection
  } = useSidebarLogic();

  const languages = useSnippetStore(useShallow(selectLanguages));
  const selectedIds = useSnippetStore(state => state.selectedIds);
  const setActiveCollection = useSnippetStore(state => state.setActiveCollection);
  const toggleFavorite = useSnippetStore(state => state.toggleFavorite);
  const bulkDelete = useSnippetStore(state => state.bulkDelete);
  const bulkToggleFavorite = useSnippetStore(state => state.bulkToggleFavorite);
  const clearSelection = useSnippetStore(state => state.clearSelection);
  const searchQuery = useSnippetStore(state => state.searchQuery);
  const setSearchQuery = useSnippetStore(state => state.setSearchQuery);
  const duplicateSnippet = useSnippetStore(state => state.duplicateSnippet);
  const deleteSnippet = useSnippetStore(state => state.deleteSnippet);

  const folders = useFolderStore(state => state.folders);
  const folderSnippetIds = useFolderStore(state => state.folderSnippetIds);
  const deleteFolder = useFolderStore(state => state.deleteFolder);
  const removeSnippetFromFolder = useFolderStore(state => state.removeSnippetFromFolder);



  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  const [isLanguagesExpanded, setIsLanguagesExpanded] = useState(true);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<Folder | undefined>();
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null);
  const [pickerSnippetId, setPickerSnippetId] = useState<string | null>(null);

  const countsSelector = useMemo(() =>
    (state: any) => selectCounts(state, folderSnippetIds || {}),
    [folderSnippetIds]
  );
  const counts = useSnippetStore(useShallow(countsSelector));

  return (
    <div className={styles.snippetList}>
      <LibrarySection
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        counts={counts}
        t={t}
      />

      <FolderSection
        folders={folders}
        isExpanded={isFoldersExpanded}
        onToggleExpand={() => setIsFoldersExpanded(!isFoldersExpanded)}
        onAddFolder={() => { setFolderToEdit(undefined); setIsFolderModalOpen(true); }}
        onEditFolder={(folder) => { setFolderToEdit(folder); setIsFolderModalOpen(true); }}
        onDeleteFolder={(folder) => setFolderToDelete(folder)}
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        folderCounts={counts.folders}
        t={t}
      />

      <LanguageSection
        languages={languages}
        isExpanded={isLanguagesExpanded}
        onToggleExpand={() => setIsLanguagesExpanded(!isLanguagesExpanded)}
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        languageCounts={counts.languages}
        t={t}
      />

      <SnippetListSection
        sortedSnippets={sortedSnippets}
        selectedId={selectedId}
        selectedIds={selectedIds}
        activeCollection={activeCollection}
        searchQuery={searchQuery}
        onSnippetClick={handleSnippetClick}
        onToggleFavorite={toggleFavorite}
        onDuplicate={(id) => {
          duplicateSnippet(id);
          addToast(t.toasts.created, 'success');
        }}
        onDelete={(id) => setSnippetToDelete(id)}
        onOpenFolderPicker={(id) => setPickerSnippetId(id)}
        onRemoveFromFolder={activeCollection.startsWith('folder:') ? (id) => {
          const folderId = activeCollection.replace('folder:', '');
          removeSnippetFromFolder(id, folderId);
          addToast(t.folders.snippetRemoved, 'info');
        } : undefined}
        onResetSearch={() => {
          setActiveCollection('all');
          setSearchQuery('');
        }}
        t={t}
      />

      {/* Overlays and Modals */}
      <BulkActionsToolbar
        count={selectedIds.length}
        onClear={clearSelection}
        onDelete={() => setIsBulkDeleteOpen(true)}
        onFavorite={(fav) => {
          bulkToggleFavorite(selectedIds, fav);
          addToast(fav ? t.toasts.favAdded : t.toasts.favRemoved, 'success');
          clearSelection();
        }}
        t={t}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => {
          const count = selectedIds.length;
          bulkDelete(selectedIds);
          setIsBulkDeleteOpen(false);
          addToast(t.toasts.bulkDeleted.replace('{count}', count.toString()), 'info');
        }}
        title={t.sidebar.bulkDeleteTitle}
        message={t.sidebar.bulkDeleteConfirm.replace('{count}', selectedIds.length.toString())}
        confirmLabel={t.editor.delete}
        cancelLabel={t.common.cancel}
      />

      <ConfirmModal
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (folderToDelete) {
            deleteFolder(folderToDelete.id);
            if (activeCollection === `folder:${folderToDelete.id}`) {
              setActiveCollection('all');
            }
            addToast(t.toasts.bulkDeleted.replace('{count}', '1'), 'info');
          }
          setFolderToDelete(null);
        }}
        title={t.folders.delete}
        message={t.folders.deleteConfirm}
        confirmLabel={t.common.delete || 'Delete'}
        cancelLabel={t.common.cancel}
      />

      <ConfirmModal
        isOpen={!!snippetToDelete}
        onClose={() => setSnippetToDelete(null)}
        onConfirm={() => {
          if (snippetToDelete) {
            deleteSnippet(snippetToDelete);
            addToast(t.toasts.bulkDeleted.replace('{count}', '1'), 'info');
            setSnippetToDelete(null);
          }
        }}
        title={t.common.delete}
        message={t.sidebar.deleteConfirm}
        confirmLabel={t.common.delete || 'Delete'}
        cancelLabel={t.common.cancel}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        folder={folderToEdit}
      />

      <FolderPicker
        snippetId={pickerSnippetId || ''}
        isOpen={!!pickerSnippetId}
        onClose={() => setPickerSnippetId(null)}
        onAddNew={() => {
          setFolderToEdit(undefined);
          setIsFolderModalOpen(true);
        }}
      />

    </div>
  );
}
