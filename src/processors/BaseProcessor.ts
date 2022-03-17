import { iMetadata } from "../interfaces/iMetadata";

export abstract class BaseProcessor {
    /**
     * Начать обработку файла, и вернуть его метаданные
     * 
     * @param source содержимое файла
     * @param path путь до файла
     */
    abstract process(source: string, path: string): iMetadata;

    /**
     * Может ли данный обработчик обрабтывать этот файл
     * 
     * @param path путь до файла
     */
    abstract canProcess(path: string): boolean;
}