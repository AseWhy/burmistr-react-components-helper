export interface iMetadata {
    toFlatData(): Record<string, any>;
    toGetPathPos(path: string): number;
}