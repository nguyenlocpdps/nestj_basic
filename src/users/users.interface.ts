export interface IUsers {
    _id: string;
    email: string;
    name: string;
    role: {
        _id: string;
        name: string;
    };
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string;
        method: string
    }[]
    age: number;
    gender: string;
    address: string;
    company: Object
    createAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    refreshToken: string;
}