export interface iMetadata {
    toFlatData(): Record<string, any>;

    toGetPathPos(path: string): number;

    update(path: string, value: any): Promise<void>;
}