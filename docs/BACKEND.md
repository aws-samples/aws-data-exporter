# Backend

## API

| Path                     | Method | Description                                                                 |
| ------------------------ | ------ | --------------------------------------------------------------------------- |
| /export                  | POST   | Export data in CSV format                                                   |
| /extract                 | POST   | Extract data from the database by specifying conditions                     |
| /extract/history         | GET    | Get user's extraction history                                               |
| /report                  | GET    | Get a list of saved reports (`?type=my`) or shared reports (`?type=shared`) |
| /report                  | POST   | Save a report                                                               |
| /report/{reportId}       | GET    | Get a report by specifying a report ID                                      |
| /report/share/{reportId} | POST   | Share a report with another user                                            |
| /table                   | GET    | Get a list of table names                                                   |
| /table/{tableName}       | GET    | Get information about a specific table                                      |
| /user                    | GET    | Get a user information                                                      |

## Database (DynamoDB)

### History Table

| Type | Name         | Example                                                                            | Description           |
| ---- | ------------ | ---------------------------------------------------------------------------------- | --------------------- |
| PK   | userId       | 4195cabc-d549-4922-bcdd-26937c00d833                                               | User ID               |
| SK   | timestamp    | 2023-04-04T08:02:09.755826                                                         | Extraction time       |
|      | columns      | ["column_a", "column_b"]                                                           | Extracted columns     |
|      | conditions   | [{"type": "string", "columnName": "name", "operator": "contains" "value": "Mike"}] | Extraction conditions |
|      | extractionId | 3a99e80b-c437-4daa-acff-a222c2f7de94                                               | Extraction ID         |
|      | tableName    | table_A                                                                            | Table name            |

### Report Table

| Type | Name          | Example                                                                               | Description                                                                   |
| ---- | ------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| PK   | userId        | 4195cabc-d549-4922-bcdd-26937c00d833                                                  | [save] User ID to save a report</br>[share] User ID receiving a shared report |
| SK   | sortKey       | timestamp#2023-04-04T11:35:03.235411</br>sharing#3368621b-8719-409c-a01f-4cc037db7f45 | [save] Report save time</br>[share] Shared report ID                          |
|      | columns       | ["column_a", "column_b"]                                                              | [save] Column names                                                           |
|      | conditions    | [{"type": "string", "columnName": "name", "operator": "contains" "value": "Mike"}]    | [save] Conditions                                                             |
|      | reportId      | cb409a4e-f127-4a5c-8674-3cd5da92c52f                                                  | [save] Report ID                                                              |
|      | reportName    | report A                                                                              | [save] Report name                                                            |
|      | tableName     | table_A                                                                               | [save] Table name                                                             |
|      | sharingUserId | e3c9850d-bd58-4662-8788-1f50c0595f22                                                  | [share] User ID to share a report                                             |

### Report Table (GSI)

| Type                                                  | Name     | Example                              | Description |
| ----------------------------------------------------- | -------- | ------------------------------------ | ----------- |
| PK                                                    | reportId | cb409a4e-f127-4a5c-8674-3cd5da92c52f | Report ID   |
| The following attributes are the same as Report Table |
