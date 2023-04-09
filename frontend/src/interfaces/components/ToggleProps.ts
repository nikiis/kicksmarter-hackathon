export interface ToggleProps {
    label?: string;
    id: string;
    onToggleChange: (isToggled: boolean) => void;
}
