# Research: Advanced Features (Recurring Tasks & Notifications)

## 1. Recurrence Logic Patterns

-   **Decision**: Backend will handle the generation of the next recurring task instance upon completion of the current one. This will involve calculating the `due_datetime` based on the `recurrence_type` (daily, weekly, monthly). The completed task will be marked `is_archived=True`.
-   **Rationale**: Centralizing recurrence logic in the backend ensures consistency and accuracy, regardless of frontend state or user's browser activity. It also simplifies frontend implementation.
-   **Alternatives considered**:
    *   **Frontend-only recurrence**: Prone to inconsistencies if the user doesn't open the app regularly or if client-side logic varies.
    *   **External cron service**: Explicitly excluded by constraints ("No background jobs or cron services").

## 2. Client-Side Notification Best Practices (Web Notifications API)

-   **Decision**: Utilize the standard Web Notifications API for browser notifications. Notifications will be triggered by a frontend service that polls the backend for upcoming tasks. The frontend will manage notification permissions and display.
-   **Rationale**: This aligns with the constraint of "Notifications work only when browser is open" and "No background jobs or cron services". It's a standard browser feature and provides a native look and feel.
-   **Alternatives considered**:
    *   **Push API**: Requires a service worker and push server, adding complexity not allowed by "No push services" constraint.
    *   **Simple browser alerts**: Less user-friendly and intrusive.

## 3. Due Date & Time Pickers in UI

-   **Decision**: Integrate a single date-time picker component in the UI for `due_datetime`. A common pattern is HTML5 `input type="datetime-local"`, or a robust third-party React component.
-   **Rationale**: Provides a user-friendly and familiar interface for setting precise dates and times, aligning with UI principles.
-   **Alternatives considered**:
    *   Separate date and time inputs: More cumbersome for users.
    *   Manual text input: Prone to parsing errors and poor UX.

## 4. Archiving Completed Recurring Tasks

-   **Decision**: When a recurring task is completed, its `is_archived` flag will be set to `True`, and a new task will be created for the next recurrence. A `recurrence_id` will link instances of the same recurring task.
-   **Rationale**: This preserves a history of completed recurring tasks without cluttering the active task list. The `recurrence_id` helps in tracking the series.
-   **Alternatives considered**:
    *   Deleting completed instances: Lose historical data.
    *   Overwriting: Lose historical data, breaks "archived, not overwritten" requirement.

## 5. API for Upcoming Tasks

-   **Decision**: The backend will expose a new API endpoint, `/tasks/upcoming`, which returns tasks that are due soon. This endpoint will be used by the frontend notification logic to determine which notifications to trigger.
-   **Rationale**: Provides the necessary data for client-side notification scheduling without requiring the frontend to fetch all tasks and filter them, which could be inefficient.
-   **Alternatives considered**:
    *   Frontend filters all tasks: Inefficient for large task lists.
    *   Backend pushes notifications: Excluded by "No push services" constraint.
