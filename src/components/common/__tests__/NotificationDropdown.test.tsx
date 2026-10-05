import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotificationDropdown from '../NotificationDropdown';
import { useActivityStore } from '@/store/useActivityStore';

const renderNotificationDropdown = () => {
  return render(
    <MemoryRouter>
      <NotificationDropdown />
    </MemoryRouter>,
  );
};

describe('NotificationDropdown Component', () => {
  beforeEach(() => {
    useActivityStore.getState().clearActivities();
  });

  it('should render notification bell trigger button', () => {
    renderNotificationDropdown();
    expect(screen.getByTestId('notification-bell-btn')).toBeInTheDocument();
  });

  it('should display unread count badge when there are unread activities', () => {
    useActivityStore.getState().logActivity({
      title: 'New Hardware Added',
      entityName: 'Dell Monitor',
      isUnread: true,
    });
    useActivityStore.getState().logActivity({
      title: 'Employee Onboarded',
      entityName: 'John Doe',
      isUnread: true,
    });

    renderNotificationDropdown();

    const badge = screen.getByTestId('notification-unread-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('2');
  });

  it('should toggle notification panel when clicking bell icon', () => {
    useActivityStore.getState().logActivity({
      title: 'New Hardware Added',
      entityName: 'Dell Monitor',
      isUnread: true,
    });

    renderNotificationDropdown();

    expect(screen.queryByTestId('notification-panel')).not.toBeInTheDocument();

    const bellBtn = screen.getByTestId('notification-bell-btn');
    fireEvent.click(bellBtn);

    expect(screen.getByTestId('notification-panel')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('New Hardware Added')).toBeInTheDocument();
  });

  it('should mark all notifications as read when clicking Mark all read', () => {
    useActivityStore.getState().logActivity({
      title: 'New Hardware Added',
      entityName: 'Dell Monitor',
      isUnread: true,
    });
    useActivityStore.getState().logActivity({
      title: 'Employee Onboarded',
      entityName: 'John Doe',
      isUnread: true,
    });

    renderNotificationDropdown();

    const bellBtn = screen.getByTestId('notification-bell-btn');
    fireEvent.click(bellBtn);

    const markAllBtn = screen.getByTestId('mark-all-read-btn');
    fireEvent.click(markAllBtn);

    expect(useActivityStore.getState().getUnreadCount('all')).toBe(0);
    expect(screen.queryByTestId('notification-unread-badge')).not.toBeInTheDocument();
    expect(screen.getByText('All caught up')).toBeInTheDocument();
  });

  it('should render empty state message when no activities are present', () => {
    renderNotificationDropdown();

    const bellBtn = screen.getByTestId('notification-bell-btn');
    fireEvent.click(bellBtn);

    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
  });
});
