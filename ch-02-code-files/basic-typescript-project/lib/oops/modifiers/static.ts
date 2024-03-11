class User {
  static user_name: string = 'Jack';
  public static calculateWorkingHoursPerMonth(hrsPerDay: number) {
    return hrsPerDay * 30;
  }
  public static setUserName(name: string) {
    User.user_name = name;
  }
}
const user = User.user_name;
console.log(`Username = ${user}`);
const totalHrs = User.calculateWorkingHoursPerMonth(8);
console.log(`Total hrs per month = ${totalHrs}`);
User.setUserName('Panchal');
console.log(`Modified Username = ${User.user_name}`);
