export class Book {
    bookName: string = "";
    bookReader: string = "";
    bookRecorder: string = "";

    isEdit: boolean = false;

    static Clone(entry: any): Book {
        var result = new Book();
        result.bookName = entry.bookName;
        result.bookReader = entry.bookReader;
        result.bookRecorder = entry.bookRecorder;
        result.isEdit = entry.isEdit;
        return result;
    }
}