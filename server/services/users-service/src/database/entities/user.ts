import {UserModel} from 'core/@types/models';
import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
/**
 * User entity containing a identifier, token and a phone number.
 *
 * @export
 * @class User
 */
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: string;

  /**
   * Creates an instance of User.
   *
   * @param {UserModel} [user]
   * @memberof User
   */
  constructor(user?: UserModel) {
    super();

    if (user) {
      // TODO: Validation of phone number

      // Parameter setting
      this.phoneNumber = user.phoneNumber;
      this.token = user.token;
    }
  }
}
