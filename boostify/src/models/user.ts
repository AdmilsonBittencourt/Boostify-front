
export interface ILogin {
    email: string;
    password: string;
}

export default class User {

    private id?: number;
    private name: string;
    private email: string;
    private hashedPassword: string;

    constructor(name: string, email: string, hashedPassword: string, id?: number) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }

    public static createWithoutId(name: string, email: string, hashedPassword: string): User {
        return new User(name, email, hashedPassword);
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public gethashedPassword(): string {
        return this.hashedPassword;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public sethashedPassword(hashedPassword: string): void {
        this.hashedPassword = hashedPassword;
    }
}