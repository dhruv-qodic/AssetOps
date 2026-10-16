import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AssetFilterPresetModal from '../AssetFilterPresetModel';

describe('AssetFilterPresetModal Component', () => {
  it('should render dialog with input and buttons when open', () => {
    const handleSave = vi.fn();
    const setPresetName = vi.fn();
    const setIsOpen = vi.fn();

    render(
      <AssetFilterPresetModal
        isSavePresetOpen={true}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsOpen}
        presetName="Engineering MacBooks"
        handleSavePreset={handleSave}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Save Filter Preset' })).toBeInTheDocument();
    expect(
      screen.getByText('Give this filter combination a name so you can reuse it later.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Preset Name')).toHaveValue('Engineering MacBooks');
  });

  it('should update preset name when typing in input', () => {
    const handleSave = vi.fn();
    const setPresetName = vi.fn();
    const setIsOpen = vi.fn();

    render(
      <AssetFilterPresetModal
        isSavePresetOpen={true}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsOpen}
        presetName=""
        handleSavePreset={handleSave}
      />,
    );

    const input = screen.getByLabelText('Preset Name');
    fireEvent.change(input, { target: { value: 'Available Laptops' } });

    expect(setPresetName).toHaveBeenCalledWith('Available Laptops');
  });

  it('should disable Save Preset button when presetName is empty or only whitespace', () => {
    const handleSave = vi.fn();
    const setPresetName = vi.fn();
    const setIsOpen = vi.fn();

    render(
      <AssetFilterPresetModal
        isSavePresetOpen={true}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsOpen}
        presetName="   "
        handleSavePreset={handleSave}
      />,
    );

    const saveBtn = screen.getByRole('button', { name: 'Save Preset' });
    expect(saveBtn).toBeDisabled();
  });

  it('should call handleSavePreset when Save Preset button is clicked with valid name', () => {
    const handleSave = vi.fn();
    const setPresetName = vi.fn();
    const setIsOpen = vi.fn();

    render(
      <AssetFilterPresetModal
        isSavePresetOpen={true}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsOpen}
        presetName="High Value Servers"
        handleSavePreset={handleSave}
      />,
    );

    const saveBtn = screen.getByRole('button', { name: 'Save Preset' });
    expect(saveBtn).toBeEnabled();
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('should call handleSavePreset on Enter key press in input with valid name', () => {
    const handleSave = vi.fn();
    const setPresetName = vi.fn();
    const setIsOpen = vi.fn();

    render(
      <AssetFilterPresetModal
        isSavePresetOpen={true}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsOpen}
        presetName="New Monitors"
        handleSavePreset={handleSave}
      />,
    );

    const input = screen.getByLabelText('Preset Name');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('should reset name and close dialog when Cancel button is clicked', () => {
    const handleSave = vi.fn();
    const setPresetName = vi.fn();
    const setIsOpen = vi.fn();

    render(
      <AssetFilterPresetModal
        isSavePresetOpen={true}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsOpen}
        presetName="Draft Preset"
        handleSavePreset={handleSave}
      />,
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(setPresetName).toHaveBeenCalledWith('');
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
