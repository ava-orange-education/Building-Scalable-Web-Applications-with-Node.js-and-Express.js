interface User {
    id: number;
    name: string;
    email: string;
}

export const users: User[] = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
];
export class Users {
    public getUserById(userId) {
        if (users.find(i => i.id == userId)) {
            return true;
        } else {
            return false;
        }
    }
}
