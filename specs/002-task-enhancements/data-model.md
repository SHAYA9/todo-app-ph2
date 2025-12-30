# Data Model: Task Enhancements

## Enum: Priority

Represents the importance level of a task.

### Values
- `high`
- `medium`
- `low`

### Default
- `medium`

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
- **priority**:
    - Type: `Priority` (Enum)
    - Required: `true`
    - Default: `medium`
    - Description: The importance level of the task.
- **tags**:
    - Type: `list of strings`
    - Required: `true`
    - Default: `[]` (empty list)
    - Description: A list of short string labels for categorization. Stored as JSONB in PostgreSQL.
- **due_date**:
    - Type: `datetime` (optional)
    - Required: `false`
    - Description: An optional deadline for the task.
- **created_at**:
    - Type: `datetime`
    - Description: A timestamp indicating when the task was created.
- **updated_at**:
    - Type: `datetime`
    - Description: A timestamp indicating when the task was last updated.

### Relationships

None.
