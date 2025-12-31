# Data Model: Advanced Features (Recurring Tasks & Notifications)

## Enum: RecurrenceTypeEnum

Represents the type of recurrence for a task.

### Values
- `daily`
- `weekly`
- `monthly`

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
    - Type: `PriorityEnum` (Enum)
    - Required: `true`
    - Default: `medium`
    - Description: The importance level of the task.
- **tags**:
    - Type: `list of strings`
    - Required: `true`
    - Default: `[]` (empty list)
    - Description: A list of short string labels for categorization. Stored as JSONB in PostgreSQL.
- **due_datetime**:
    - Type: `datetime` (optional)
    - Required: `false`
    - Description: The combined date and time for the task due. Replaces previous `due_date`.
- **recurrence_type**:
    - Type: `RecurrenceTypeEnum` (Enum)
    - Required: `false`
    - Default: `None`
    - Description: The type of recurrence for the task.
- **recurrence_id**:
    - Type: `string` (UUID)
    - Required: `false`
    - Default: `None`
    - Description: A unique identifier to group instances of a recurring task.
- **is_archived**:
    - Type: `boolean`
    - Required: `true`
    - Default: `false`
    - Description: A flag indicating if a task is an archived instance of a recurring task.
- **created_at**:
    - Type: `datetime`
    - Description: A timestamp indicating when the task was created.
- **updated_at**:
    - Type: `datetime`
    - Description: A timestamp indicating when the task was last updated.

### Relationships

None.
