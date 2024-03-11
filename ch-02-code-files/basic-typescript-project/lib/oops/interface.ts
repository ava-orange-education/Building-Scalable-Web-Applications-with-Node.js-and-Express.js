interface IUser {
    first_name: string;
    last_name: string;
    email_id: string;
    assigned_project_code: number;
    assigned_project_name?: string;
    working_hrs_per_day: number;
}

const userData: IUser = {
  first_name: 'Jack',
  last_name: 'Panchal',
  email_id: 'yami@gmail.com',
  assigned_project_code: 1,
  working_hrs_per_day: 8
};


class UserClass implements IUser {
  first_name: string;
  last_name: string;
  email_id: string;
  assigned_project_code: number;
  assigned_project_name?: string;
  working_hrs_per_day: number;

  constructor(first_name: string, last_name: string) {
    this.first_name = first_name;
    this.last_name = last_name;
  }
}
const newUser: IUser = new UserClass('Jack', 'Panchal');
newUser.email_id = 'yami@gmail.com';
console.log(`User = ${JSON.stringify(newUser)}`);
