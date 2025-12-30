# Research: Task Enhancements (Intermediate Level)

## 1. Filter/Sort Patterns in REST APIs

- **Decision**: Implement filtering, searching, and sorting functionality using query parameters on the `GET /tasks` endpoint.
- **Rationale**: This is a widely accepted and RESTful approach. It keeps the base URL clean, allows for easy caching, and is well-supported by various client-side libraries.
- **Alternatives considered**:
    - **Custom endpoints**: Creating separate endpoints like `/tasks/search`, `/tasks/filter` would lead to endpoint proliferation and less flexible combinations.
    - **Request body for GET**: While possible, it's less conventional and can interfere with caching mechanisms.

## 2. UI Usability Patterns for Productivity Apps

- **Decision**:
    - **Priority Selector**: Use a dropdown or radio buttons for selecting "high", "medium", "low" priority.
    - **Tags Input**: Implement a clear input field for adding tags, with visual representation of added tags (e.g., chips/badges) and an easy way to remove them.
    - **Due Date Picker**: Use a standard date picker component for selecting optional due dates.
    - **Search Input**: A prominent search bar for keyword search on task titles.
    - **Filter Controls**: Checkboxes, dropdowns, or toggle buttons for completion status, priority, and due date presence.
    - **Sort Controls**: Dropdown for selecting sort criteria (title, priority, due date) and toggle for ascending/descending order.
- **Rationale**: These patterns are common in productivity applications, providing a familiar and intuitive user experience.
- **Alternatives considered**:
    - **Custom UI elements**: Would require more development effort and might lead to a less familiar user experience.
    - **Limited filtering/sorting**: Reducing options would limit usability.

## 3. Tags Storage in PostgreSQL with SQLModel

- **Decision**: Store tags as a JSONB column in PostgreSQL.
- **Rationale**: PostgreSQL's JSONB type is highly efficient for storing semi-structured data like an array of strings. SQLModel/Pydantic can easily map Python `list[str]` to JSONB using `sa.Column(JSON)`. This avoids the complexity of a separate many-to-many relationship table for a simple list of tags.
- **Alternatives considered**:
    - **Separate `TaskTag` table**: Overkill for simple string tags and would complicate queries for filtering.
    - **Comma-separated string**: Difficult to query and maintain data integrity.
