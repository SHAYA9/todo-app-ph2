# Data Model: Task

## Entity: Task

Represents a single to-do item.

### Fields

- **id**:
    - Type: `integer`
    - Primary Key: `true`
    - Description: A unique identifier for the task.
- **title**:
    - Type: `string`
    - Required: `true`
    - Description: The description of the task.
- **completed**:
    - Type: `boolean`
    - Default: `false`
    - Description: A boolean indicating whether the task is complete.
- **created_at**:
    - Type: `timestamp`
    - Description: A timestamp indicating when the task was created.
- **updated_at**:
    - Type: `timestamp`
    - Description: A timestamp indicating when the task was last updated.

### Relationships

None.
