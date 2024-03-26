import {promisePool} from '../../database/db';
import CustomError from '../../classes/CustomError';
//added: ResultSetHeader for typing the result of insert and delete operations
//RowDataPacket for the result of select queries
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Cat} from '../../types/DBTypes';
import {MessageResponse, UploadResponse} from '../../types/MessageTypes';

//added: select columns from sfff_cat table
//function calls extract the latitude and longitude from coords column, results are aliased as lat and lng
//constructs a JSON object containing the user_id and user_name from the joind sssf_user table, aliasign it as owner
//JOIN operation connects sssf_cat to sssf_user
//on condition that owner column in sssf_cat matches the user_id in sssf_user
const getAllCats = async (): Promise<Cat[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Cat[]>(
    `
    SELECT cat_id, cat_name, weight, filename, birthdate, ST_X(coords) AS lat, ST_Y(coords) AS lng,
    JSON_OBJECT('user_id', sssf_user.user_id, 'user_name', sssf_user.user_name) AS owner 
	  FROM sssf_cat 
	  JOIN sssf_user 
    ON sssf_cat.owner = sssf_user.user_id
    `
  );
  if (rows.length === 0) {
    throw new CustomError('No cats found', 404);
  }
  const cats = (rows as Cat[]).map((row) => ({
    ...row,
    owner: JSON.parse(row.owner?.toString() || '{}'),
  }));

  return cats;
};

// TODO: create getCat function to get single cat
const getCat = async (catId: number): Promise<Cat> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Cat[]>(
    `
    SELECT cat_id, cat_name, weight, filename, birthdate, ST_X(coords) AS lat, ST_Y(coords) AS lng,
    JSON_OBJECT('user_id', user_id, 'user_name', user_name) AS owner
    FROM sssf_cat
    JOIN sssf_user 
    ON sssf_cat.owner = sssf_user.user_id 
    WHERE cat_id = ?;
    `,
    [catId]
  );
  
  if (rows.length === 0) {
    throw new CustomError('Cat not found', 404);
  }

  return rows[0];
};


// TODO: use Utility type to modify Cat type for 'data'.
// Note that owner is not User in this case. It's just a number (user_id)
type CatInsertData = Omit<Cat, 'owner'> & {owner: number};
const addCat = async (data: CatInsertData): Promise<MessageResponse> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `
    INSERT INTO sssf_cat (cat_name, weight, owner, filename, birthdate, coords) 
    VALUES (?, ?, ?, ?, ?, POINT(?, ?))
    `,
    [
      data.cat_name,
      data.weight,
      data.owner,
      data.filename,
      data.birthdate,
      data.lat,
      data.lng,
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('No cats added', 400);
  }
  return {message: 'Cat added'};
};

// TODO: create updateCat function to update single cat
// if role is admin, update any cat
// if role is user, update only cats owned by user
// You can use updateUser function from userModel as a reference for SQL

const deleteCat = async (catId: number): Promise<MessageResponse> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `
    DELETE FROM sssf_cat 
    WHERE cat_id = ?;
    `,
    [catId]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('No cats deleted', 400);
  }
  return {message: 'Cat deleted'};
};

export {getAllCats, getCat, addCat, updateCat, deleteCat};
