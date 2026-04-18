import React from 'react';
import { 
  SiTypescript, SiJavascript, SiPython, SiRust, SiGo, 
  SiReact, SiVuedotjs, SiSvelte, SiPhp, SiCplusplus, 
  SiDotnet, SiHtml5, SiCss, SiJson, SiDocker, 
  SiMarkdown, SiGnubash, SiYaml, SiRuby, SiSwift, 
  SiKotlin, SiPostgresql, SiGit, SiVite, SiTailwindcss,
  SiGraphql, SiPrisma, SiMysql, SiMongodb, SiRedis,
  SiFlutter, SiDart
} from 'react-icons/si';
import { 
  DiJavascript, DiPython, DiGo, DiReact, DiPhp, 
  DiJava, DiHtml5, DiCss3, 
  DiRuby, DiSwift, DiPostgresql, DiMongodb,
  DiDotnet, DiRust, DiGit, DiMysql, DiRedis, DiLinux
} from 'react-icons/di';
import { 
  TbBrandTypescript, TbBrandJavascript, TbBrandPython, TbBrandRust, 
  TbBrandGolang, TbBrandReact, TbBrandVue, TbBrandSvelte, 
  TbBrandPhp, TbBrandCpp, TbBrandCSharp, TbFileTypeHtml, 
  TbFileTypeCss, TbJson, TbBrandDocker, TbMarkdown, 
  TbBrandTailwind, TbBrandVite, TbBrandGraphql, TbBrandPrisma,
  TbBrandMysql, TbBrandMongodb, TbBrandFlutter, TbBrandKotlin,
  TbGitBranch, TbFileTypeXml, TbFileTypeSql, TbBrandSwift, 
  TbTerminal2
} from 'react-icons/tb';

import { FileCode, FileText } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

interface TechIconProps {
  lang: string;
  size?: number;
  className?: string;
  showColor?: boolean;
}

export const TechIcon: React.FC<TechIconProps> = ({ 
  lang, 
  size = 16, 
  className = '',
  showColor = true 
}) => {
  const iconPack = useSettingsStore(state => state.iconPack);
  const l = lang.toLowerCase();

  // Mapping for BRAND style (Simple Icons)
  const brandMap: Record<string, { icon: React.ElementType, color: string }> = {
    'typescript': { icon: SiTypescript, color: '#3178C6' },
    'tsx': { icon: SiTypescript, color: '#3178C6' },
    'javascript': { icon: SiJavascript, color: '#F7DF1E' },
    'jsx': { icon: SiJavascript, color: '#F7DF1E' },
    'react': { icon: SiReact, color: '#61DAFB' },
    'vue': { icon: SiVuedotjs, color: '#42B883' },
    'svelte': { icon: SiSvelte, color: '#FF3E00' },
    'python': { icon: SiPython, color: '#3776AB' },
    'rust': { icon: SiRust, color: '#DEA584' },
    'go': { icon: SiGo, color: '#00ADD8' },
    'php': { icon: SiPhp, color: '#777BB4' },
    'java': { icon: DiJava, color: '#007396' },
    'cpp': { icon: SiCplusplus, color: '#00599C' },
    'c': { icon: SiCplusplus, color: '#00599C' },
    'csharp': { icon: SiDotnet, color: '#239120' },
    'ruby': { icon: SiRuby, color: '#CC342D' },
    'swift': { icon: SiSwift, color: '#F05138' },
    'kotlin': { icon: SiKotlin, color: '#7F52FF' },
    'sql': { icon: SiPostgresql, color: '#4479A1' },
    'html': { icon: SiHtml5, color: '#E34F26' },
    'xml': { icon: SiHtml5, color: '#E34F26' },
    'css': { icon: SiCss, color: '#1572B6' },
    'scss': { icon: SiCss, color: '#1572B6' },
    'json': { icon: SiJson, color: '#000000' },
    'yaml': { icon: SiYaml, color: '#CB171E' },
    'dockerfile': { icon: SiDocker, color: '#2496ED' },
    'docker': { icon: SiDocker, color: '#2496ED' },
    'markdown': { icon: SiMarkdown, color: '#000000' },
    'bash': { icon: SiGnubash, color: '#4EAA25' },
    'shell': { icon: SiGnubash, color: '#4EAA25' },
    'git': { icon: SiGit, color: '#F05032' },
    'vite': { icon: SiVite, color: '#646CFF' },
    'tailwind': { icon: SiTailwindcss, color: '#06B6D4' },
    'graphql': { icon: SiGraphql, color: '#E10098' },
    'prisma': { icon: SiPrisma, color: '#2D3748' },
    'mysql': { icon: SiMysql, color: '#4479A1' },
    'mongodb': { icon: SiMongodb, color: '#47A248' },
    'redis': { icon: SiRedis, color: '#DC382D' },
    'flutter': { icon: SiFlutter, color: '#02569B' },
    'dart': { icon: SiDart, color: '#0175C2' },
  };

  // Mapping for CLASSIC style (Devicons)
  const classicMap: Record<string, { icon: React.ElementType, color: string }> = {
    'javascript': { icon: DiJavascript, color: '#F7DF1E' },
    'jsx': { icon: DiJavascript, color: '#F7DF1E' },
    'typescript': { icon: SiTypescript, color: '#3178C6' }, // Fallback to SI
    'tsx': { icon: SiTypescript, color: '#3178C6' },
    'python': { icon: DiPython, color: '#3776AB' },
    'go': { icon: DiGo, color: '#00ADD8' },
    'react': { icon: DiReact, color: '#61DAFB' },
    'php': { icon: DiPhp, color: '#777BB4' },
    'java': { icon: DiJava, color: '#007396' },
    'cpp': { icon: SiCplusplus, color: '#00599C' }, // Manual override or handled by brand fallback
    'c': { icon: SiCplusplus, color: '#00599C' },
    'ruby': { icon: DiRuby, color: '#CC342D' },
    'swift': { icon: DiSwift, color: '#F05138' },
    'sql': { icon: DiPostgresql, color: '#4479A1' },
    'html': { icon: DiHtml5, color: '#E34F26' },
    'css': { icon: DiCss3, color: '#1572B6' },
    'rust': { icon: DiRust, color: '#DEA584' },
    'git': { icon: DiGit, color: '#F05032' },
    'mysql': { icon: DiMysql, color: '#4479A1' },
    'mongodb': { icon: DiMongodb, color: '#47A248' },
    'redis': { icon: DiRedis, color: '#DC382D' },
    'bash': { icon: DiLinux, color: '#4EAA25' },
    'shell': { icon: DiLinux, color: '#4EAA25' },
    'csharp': { icon: DiDotnet, color: '#239120' },
  };

  // Mapping for MINIMAL style (Tabler Icons)
  const minimalMap: Record<string, { icon: React.ElementType }> = {
    'typescript': { icon: TbBrandTypescript },
    'tsx': { icon: TbBrandTypescript },
    'javascript': { icon: TbBrandJavascript },
    'jsx': { icon: TbBrandJavascript },
    'python': { icon: TbBrandPython },
    'rust': { icon: TbBrandRust },
    'go': { icon: TbBrandGolang },
    'react': { icon: TbBrandReact },
    'vue': { icon: TbBrandVue },
    'svelte': { icon: TbBrandSvelte },
    'php': { icon: TbBrandPhp },
    'cpp': { icon: TbBrandCpp },
    'c': { icon: TbBrandCpp },
    'csharp': { icon: TbBrandCSharp },
    'html': { icon: TbFileTypeHtml },
    'xml': { icon: TbFileTypeXml },
    'css': { icon: TbFileTypeCss },
    'scss': { icon: TbFileTypeCss },
    'json': { icon: TbJson },
    'docker': { icon: TbBrandDocker },
    'dockerfile': { icon: TbBrandDocker },
    'markdown': { icon: TbMarkdown },
    'git': { icon: TbGitBranch },
    'vite': { icon: TbBrandVite },
    'tailwind': { icon: TbBrandTailwind },
    'graphql': { icon: TbBrandGraphql },
    'prisma': { icon: TbBrandPrisma },
    'mysql': { icon: TbBrandMysql },
    'mongodb': { icon: TbBrandMongodb },
    'flutter': { icon: TbBrandFlutter },
    'dart': { icon: TbBrandFlutter }, 
    'kotlin': { icon: TbBrandKotlin },
    'swift': { icon: TbBrandSwift },
    'bash': { icon: TbTerminal2 },
    'shell': { icon: TbTerminal2 },
    'sql': { icon: TbFileTypeSql },
  };

  const getIconConfig = () => {
    switch(iconPack) {
      case 'classic':
        return classicMap[l] || brandMap[l]; // Fallback to brand for missing icons
      case 'minimal':
        const cfg = minimalMap[l];
        return cfg ? { icon: cfg.icon, color: 'currentColor' } : (brandMap[l] ? { icon: brandMap[l].icon, color: 'currentColor' } : null);
      case 'brand':
      default:
        return brandMap[l];
    }
  };

  const config = getIconConfig();

  if (config) {
    const IconComponent = config.icon;
    return (
      <IconComponent 
        size={size} 
        color={showColor ? config.color : 'currentColor'} 
        className={className}
      />
    );
  }

  // Fallback for text and unknown types
  if (l === 'text' || l === 'plain text') {
    return <FileText size={size} className={className} />;
  }

  return <FileCode size={size} className={className} />;
};
