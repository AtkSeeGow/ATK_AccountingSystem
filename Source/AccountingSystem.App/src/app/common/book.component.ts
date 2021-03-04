export class Book {
    name: string = "";
    reader: string = "";
    recorder: string = "";

    isEdit: boolean = false;

    static Clone(entry: any): Book {
        const result = new Book();
        result.name = entry.name;
        result.reader = entry.reader;
        result.recorder = entry.recorder;
        result.isEdit = entry.isEdit;
        return result;
    }
}
