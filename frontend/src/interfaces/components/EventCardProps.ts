export interface EventCardProps {
    time: number;
    name: string;
    number: number;
    position: string;
    xGoals?: number;
    length?: number;
    jerseyColour?: string;
    textColour?: string;
    onClick: (time: number) => void;
}
