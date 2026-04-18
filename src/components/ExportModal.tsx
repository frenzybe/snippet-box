import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Palette, Settings, Type } from 'lucide-react';

import { Snippet } from '../types';
import { ExportPreview } from './ExportPreview';
import { EXPORT_GRADIENTS, ExportBackground } from '../utils/exportGradients';
import { EXPORT_FONTS, ExportFont } from '../utils/exportFonts';
import { useSettingsStore } from '../store/useSettingsStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../hooks';
import { useLocale } from '../context/LocaleContext';

import { ExportHeader } from './Export/components/ExportHeader';
import { BackgroundSettings } from './Export/components/BackgroundSettings';
import { CanvasSettings } from './Export/components/CanvasSettings';
import { ExportEditorSettings } from './Export/components/ExportEditorSettings';

import styles from './Export/Export.module.css';

interface ExportModalProps {
  snippet: Snippet;
  varValues?: Record<string, string>;
  initialFileId?: string;
  onClose: () => void;
}

export function ExportModal({ snippet, varValues, initialFileId, onClose }: ExportModalProps) {
  const { addToast } = useToastStore();
  const { t } = useLocale();
  const { fontSize: globalFontSize } = useSettingsStore();

  const [activeFileId, setActiveFileId] = useState(initialFileId || snippet.files[0]?.id || '');
  const activeFile = useMemo(() => {
    return snippet.files.find(f => f.id === activeFileId) || snippet.files[0];
  }, [snippet, activeFileId]);
  const [filename, setFilename] = useState(activeFile.filename);

  const [selectedBg, setSelectedBg] = useState<ExportBackground>(EXPORT_GRADIENTS[0]);
  const [isLive, setIsLive] = useState(false);
  const [customBgs, setCustomBgs] = useState<ExportBackground[]>(() => {
    const saved = localStorage.getItem('snippet-custom-bgs');
    return saved ? JSON.parse(saved) : [];
  });
  const [creator, setCreator] = useState({
    type: 'gradient' as 'solid' | 'gradient',
    color1: '#f093fb',
    color2: '#f5576c',
    angle: 45
  });

  const [activeTab, setActiveTab] = useState<'background' | 'editor' | 'config'>('background');
  const [padding, setPadding] = useState(64);
  const [scale, setScale] = useState(0.8);
  const [shadowOpacity, setShadowOpacity] = useState(0.4);
  const [cornerRadius, setCornerRadius] = useState(12);
  const [windowStyle, setWindowStyle] = useState<'macOS' | 'minimal' | 'glass'>('macOS');

  const [localFontSize, setLocalFontSize] = useState(globalFontSize || 14);
  const [lineNumbers, setLineNumbers] = useState(false);
  const [lineWrapping, setLineWrapping] = useState(true);
  const [selectedFont, setSelectedFont] = useState<ExportFont>(EXPORT_FONTS[EXPORT_FONTS.length - 1]);
  const [markdownPreview, setMarkdownPreview] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [copying, setCopying] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const { themeExtension } = useTheme(activeFile?.language || 'text');

  React.useEffect(() => { setFilename(activeFile.filename); }, [activeFile.id]);
  React.useEffect(() => { localStorage.setItem('snippet-custom-bgs', JSON.stringify(customBgs)); }, [customBgs]);

  const creatorValue = creator.type === 'solid'
    ? creator.color1
    : `linear-gradient(${creator.angle}deg, ${creator.color1} 0%, ${creator.color2} 100%)`;

  const displayedBg = isLive ? creatorValue : selectedBg.value;

  const updateCreator = (updates: Partial<typeof creator>) => {
    setCreator(prev => ({ ...prev, ...updates }));
    setIsLive(true);
  };

  const handleCreateBg = () => {
    const newBg: ExportBackground = {
      id: `custom-${Date.now()}`,
      name: 'Custom Style',
      value: creatorValue,
      type: creator.type
    };
    setCustomBgs(prev => [newBg, ...prev]);
    setSelectedBg(newBg);
    setIsLive(false);
    addToast(t.export.toasts.saveSuccess, 'success');
  };

  const deleteCustomBg = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomBgs(prev => prev.filter(bg => bg.id !== id));
    if (selectedBg.id === id) setSelectedBg(EXPORT_GRADIENTS[0]);
    addToast(t.export.toasts.saveSuccess, 'success');
  };

  const handleCopy = async () => {
    if (!previewRef.current) return;
    setCopying(true);
    try {
      const copyPromise = (async () => {
        const dataUrl = await toPng(previewRef.current!, { pixelRatio: 2 });
        const resp = await fetch(dataUrl);
        return await resp.blob();
      })();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': copyPromise })]);
      setTimeout(() => setCopying(false), 2000);
      addToast(t.export.toasts.copySuccess, 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      setCopying(false);
      addToast(t.export.toasts.copyError, 'error');
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      addToast(t.export.toasts.saveSuccess, 'success');
    } catch (err) {
      console.error('Export failed:', err);
      addToast(t.export.toasts.saveError, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleDownload(); }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDownload, onClose]);

  return (
    <AnimatePresence>
      <motion.div className={styles.overlay} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className={styles.modal}
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
        >
          <ExportHeader
            filename={filename} setFilename={setFilename}
            copying={copying} isExporting={isExporting}
            onCopy={handleCopy} onDownload={handleDownload}
            onClose={onClose} t={t}
          />

          <div className={styles.content}>
            <div className={styles.settings}>
              <div className={styles.tabs}>
                {[
                  { id: 'background', icon: Palette, label: t.export.tabs.background },
                  { id: 'editor', icon: Type, label: t.export.tabs.editor },
                  { id: 'config', icon: Settings, label: t.export.tabs.config }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} className={`${styles.tabItem} ${isActive ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab.id as any)}>
                      <Icon size={18} />
                      {isActive && <motion.div layoutId="activeTabExport" className={styles.activeTabBadge} />}
                    </button>
                  );
                })}
              </div>

              <div className={styles.settingsContent}>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={styles.tabContentWrapper}>
                    {activeTab === 'background' && (
                      <BackgroundSettings
                        creator={creator} updateCreator={updateCreator} handleCreateBg={handleCreateBg}
                        customBgs={customBgs} deleteCustomBg={deleteCustomBg}
                        selectedBg={selectedBg} setSelectedBg={setSelectedBg}
                        isLive={isLive} setIsLive={setIsLive} t={t}
                      />
                    )}
                    {activeTab === 'editor' && (
                      <ExportEditorSettings
                        fontSize={localFontSize} setFontSize={setLocalFontSize}
                        selectedFont={selectedFont} setSelectedFont={setSelectedFont}
                        lineNumbers={lineNumbers} setLineNumbers={setLineNumbers}
                        lineWrapping={lineWrapping} setLineWrapping={setLineWrapping} t={t}
                      />
                    )}
                    {activeTab === 'config' && (
                      <CanvasSettings
                        padding={padding} setPadding={setPadding}
                        windowStyle={windowStyle} setWindowStyle={setWindowStyle}
                        cornerRadius={cornerRadius} setCornerRadius={setCornerRadius}
                        shadowOpacity={shadowOpacity} setShadowOpacity={setShadowOpacity}
                        scale={scale} setScale={setScale}
                        isMarkdown={activeFile.language === 'markdown'}
                        markdownPreview={markdownPreview} setMarkdownPreview={setMarkdownPreview} t={t}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className={styles.previewContainer}>
              <div className={styles.studioBg} />
              {snippet.files.length > 1 && (
                <div className={styles.fileTabs}>
                  {snippet.files.map(file => (
                    <button key={file.id} className={`${styles.fileTab} ${activeFileId === file.id ? styles.fileTabActive : ''}`} onClick={() => setActiveFileId(file.id)}>
                      {file.filename}
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.previewScroll}>
                <div style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease' }}>
                  <ExportPreview
                    ref={previewRef} file={activeFile} varValues={varValues}
                    renderMarkdown={markdownPreview} gradient={displayedBg}
                    padding={`${padding}px`} theme={themeExtension}
                    showControls={windowStyle === 'macOS'} fontSize={localFontSize}
                    lineNumbers={lineNumbers} lineWrapping={lineWrapping}
                    fontFamily={selectedFont.family} shadowOpacity={shadowOpacity}
                    cornerRadius={cornerRadius} isGlass={windowStyle === 'glass'}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
