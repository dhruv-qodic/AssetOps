import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AssetDeviceIcon } from '../AssetDeviceIcon';

describe('AssetDeviceIcon Component', () => {
  it('should render standard icons for different asset categories', () => {
    const { container: laptopContainer } = render(<AssetDeviceIcon category="Laptop" />);
    expect(laptopContainer.querySelector('svg.lucide-laptop')).toBeInTheDocument();

    const { container: mobileContainer } = render(<AssetDeviceIcon category="Mobile" />);
    expect(mobileContainer.querySelector('svg.lucide-smartphone')).toBeInTheDocument();

    const { container: monitorContainer } = render(<AssetDeviceIcon category="Monitor" />);
    expect(monitorContainer.querySelector('svg.lucide-monitor')).toBeInTheDocument();

    const { container: tabletContainer } = render(<AssetDeviceIcon category="Tablet" />);
    expect(tabletContainer.querySelector('svg.lucide-tablet')).toBeInTheDocument();

    const { container: desktopContainer } = render(<AssetDeviceIcon category="Desktop" />);
    expect(desktopContainer.querySelector('svg.lucide-hard-drive')).toBeInTheDocument();

    const { container: networkContainer } = render(<AssetDeviceIcon category="Networking" />);
    expect(networkContainer.querySelector('svg.lucide-radio')).toBeInTheDocument();

    const { container: audioContainer } = render(<AssetDeviceIcon category="Audio" />);
    expect(audioContainer.querySelector('svg.lucide-headphones')).toBeInTheDocument();

    const { container: accessoryContainer } = render(<AssetDeviceIcon category="Accessories" />);
    expect(accessoryContainer.querySelector('svg.lucide-keyboard')).toBeInTheDocument();

    const { container: otherContainer } = render(<AssetDeviceIcon category="Other" />);
    expect(otherContainer.querySelector('svg.lucide-box')).toBeInTheDocument();
  });

  it('should detect name heuristics such as airpods, headphones, keyboard, and mouse', () => {
    const { container: airpodsContainer } = render(
      <AssetDeviceIcon category="Accessories" name="Apple AirPods Pro" />,
    );
    expect(airpodsContainer.querySelector('svg.lucide-headphones')).toBeInTheDocument();

    const { container: headphoneContainer } = render(
      <AssetDeviceIcon category="Other" name="Sony WH-1000XM5 Headphone" />,
    );
    expect(headphoneContainer.querySelector('svg.lucide-headphones')).toBeInTheDocument();

    const { container: keyboardContainer } = render(
      <AssetDeviceIcon category="Other" name="Logitech MX Mechanical Keyboard" />,
    );
    expect(keyboardContainer.querySelector('svg.lucide-keyboard')).toBeInTheDocument();

    const { container: mouseContainer } = render(
      <AssetDeviceIcon category="Other" name="Logitech MX Master Mouse" />,
    );
    expect(mouseContainer.querySelector('svg.lucide-keyboard')).toBeInTheDocument();
  });

  it('should apply custom className to wrapper element', () => {
    const { container } = render(
      <AssetDeviceIcon category="Laptop" className="custom-test-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-test-class');
  });
});
