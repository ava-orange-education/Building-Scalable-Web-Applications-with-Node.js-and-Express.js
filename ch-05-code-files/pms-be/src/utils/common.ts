import * as bcrypt from 'bcrypt';

export const Rights = {
    ROLES: {
        ADD: 'add_role',
        EDIT: 'edit_role',
        GET_ALL: 'get_all_roles',
        GET_DETAILS: 'get_details_role',
        DELETE: 'delete_role',
        ALL: 'add_role,edit_role,get_all_roles,get_details_role,delete_role'
    },
    USERS: {
        ADD: 'add_user',
        EDIT: 'edit_user',
        GET_ALL: 'get_all_users',
        GET_DETAILS: 'get_details_user',
        DELETE: 'delete_user',
        ALL: 'add_user,edit_user,get_all_users,get_details_user,delete_user'
    },
    PROJECTS: {
        ADD: 'add_project',
        EDIT: 'edit_project',
        GET_ALL: 'get_all_projects',
        GET_DETAILS: 'get_details_project',
        DELETE: 'delete_project',
        ALL: 'add_project,edit_project,get_all_projects,get_details_project,delete_project'
    },
    TASKS: {
        ADD: 'add_task',
        EDIT: 'edit_task',
        GET_ALL: 'get_all_tasks',
        GET_DETAILS: 'get_details_task',
        DELETE: 'delete_task',
        ALL: 'add_task,edit_task,get_all_tasks,get_details_task,delete_task'
    },
    COMMENTS: {
        ADD: 'add_comment',
        EDIT: 'edit_comment',
        GET_ALL: 'get_all_comments',
        GET_DETAILS: 'get_details_comment',
        DELETE: 'delete_comment',
        ALL: 'add_comment,edit_comment,get_all_comments,get_details_comment,delete_comment'
    }
};
/**
 * Encrypts a string using bcrypt hashing.
 * 
 * @param {string} s - The string to be encrypted.
 * @returns {Promise<string>} - The encrypted string.
 */
export const encryptString = async (s: string) => {
    const encryptedString = await bcrypt.hash(s, 8);
    return encryptedString;
};


/**
 * Compares a plain string with a bcrypt hash to determine if they match.
 * 
 * @param {string} s - The plain string to be compared.
 * @param {string} hash - The bcrypt hash to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the comparison is successful, otherwise false.
 */
export const bcryptCompare = async (s, hash) => {
    return await bcrypt.compare(s, hash);
};

export const SERVER_CONST = {
    JWTSECRET: 'SecretKeyOfPMS-SECRET',
    ACCESS_TOKEN_EXPIRY_TIME_SECONDS: 1 * 8 * 60 * 60, // 8 hours
    REFRESH_TOKEN_EXPIRY_TIME_SECONDS: 5 * 7 * 24 * 60 * 60, // one week
};
