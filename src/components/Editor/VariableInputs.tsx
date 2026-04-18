import { Input } from '../ui/Input';
import styles from './Editor.module.css';

interface VariableInputsProps {
  vars: string[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
  placeholder: string;
}

export const VariableInputs: React.FC<VariableInputsProps> = ({
  vars,
  values,
  onChange,
  placeholder
}) => {
  if (vars.length === 0) return null;

  return (
    <div className={styles.variablesBar}>
      <div className={styles.variablesGrid}>
        {vars.map(varName => (
          <Input
            key={varName}
            label={varName}
            size="sm"
            placeholder={`${placeholder}…`}
            value={values[varName] || ''}
            onChange={(e) => onChange(varName, e.target.value)}
            onClear={() => onChange(varName, '')}
            className={styles.variableField}
          />
        ))}
      </div>
    </div>
  );
};
