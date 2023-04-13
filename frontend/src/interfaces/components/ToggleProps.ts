export interface ToggleProps {
    label?: string;
    id: string;
    initialValue?: boolean;
    onToggleChange: (isToggled: boolean) => void;
}
