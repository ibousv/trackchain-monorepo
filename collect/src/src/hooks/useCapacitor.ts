import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

export interface DeviceInfo {
  platform: string;
  isNative: boolean;
  model?: string;
  osVersion?: string;
}

export interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

export const useCapacitor = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'web',
    isNative: false
  });
  
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: true,
    connectionType: 'wifi'
  });

  useEffect(() => {
    const initCapacitor = async () => {
      // Configuration de la StatusBar
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: 'LIGHT' });
          await StatusBar.setBackgroundColor({ color: '#000000' });
          
          // Récupération des infos device
          const info = await Device.getInfo();
          setDeviceInfo({
            platform: info.platform,
            isNative: true,
            model: info.model,
            osVersion: info.osVersion
          });

          // Monitoring du réseau
          const status = await Network.getStatus();
          setNetworkStatus({
            connected: status.connected,
            connectionType: status.connectionType
          });

          Network.addListener('networkStatusChange', (status) => {
            setNetworkStatus({
              connected: status.connected,
              connectionType: status.connectionType
            });
          });

        } catch (error) {
          console.log('Capacitor initialization error:', error);
        }
      }
    };

    initCapacitor();
  }, []);

  // Fonctions utilitaires Capacitor
  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptic feedback error:', error);
      }
    }
  };

  const shareContent = async (title: string, text: string, url?: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title,
          text,
          url
        });
      } else {
        // Fallback web
        if (navigator.share) {
          await navigator.share({ title, text, url });
        } else {
          // Copier dans le presse-papier comme fallback
          await navigator.clipboard.writeText(text);
        }
      }
    } catch (error) {
      console.log('Share error:', error);
      throw error;
    }
  };

  const saveFile = async (filename: string, data: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Filesystem.writeFile({
          path: filename,
          data: data,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
        return true;
      } else {
        // Fallback web - téléchargement
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
      }
    } catch (error) {
      console.log('Save file error:', error);
      return false;
    }
  };

  const handleBackButton = (callback: () => void) => {
    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', callback);
      return () => {
        App.removeAllListeners();
      };
    }
    return () => {};
  };

  return {
    deviceInfo,
    networkStatus,
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
    hapticFeedback,
    shareContent,
    saveFile,
    handleBackButton
  };
};