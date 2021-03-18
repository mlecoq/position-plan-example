import React, {useState} from 'react';
import {
  StyleSheet,
  NativeModules,
  View,
  PermissionsAndroid,
} from 'react-native';
import PSPDFKitView from '@archireport/react-native-pspdfkit';

const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(
  'PdMlw30CJ_9IFUWpRDnxG_zEXL7ZzOSENLyZJKOiCCnTLzggKbCfdgS2jxsE4rEvXWcQ9vkzjfr2R9eYNW61ifX3WSmz5zIZe4S0vZF7VOv7NxcPfZxhKrLEDez8cWEpnkYgPq9nRtieIHDo9DQdn8K3L8qXGXNmDQrHVgG8q7',
);

const DOCUMENT = 'file:///sdcard/document.pdf';
const DOCUMENT_IMAGE = 'file:///sdcard/image.jpg';
const CONFIGURATION = {
  scrollContinuously: false,
  showPageNumberOverlay: true,
  pageScrollDirection: 'vertical',
};

/**
 * Convert and index to an alaphabetic letter or string (0 -> a, 1 -> b, c, d, e ... aa, ab, ac)
 */
export const indexChar = (index: number, postfix = ''): string => {
  const alphabetMax = 26;

  return index < alphabetMax
    ? String.fromCharCode(97 + index) + postfix
    : indexChar(
        Math.floor(index / alphabetMax) - 1,
        indexChar(index % alphabetMax),
      );
};

// Change 'YourApp' to your app's name.
const YourApp = () => {
  const [length, setLength] = useState(10);

  const [positions, setPositions] = useState([
    {
      page: 0,
      positions: [
        {name: '1.a', x: 0.5, y: 0.5},
        {name: '1.b', x: 0.2, y: 0.2},
      ],
    },
  ]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, width: 300}}>
        <PSPDFKitView
          document={DOCUMENT}
          configuration={{
            pageTransition: 'scrollContinuous',
            pageScrollDirection: 'vertical',
            documentLabelEnabled: true,
            pageMode: 'single',
            showPageNumberOverlay: true,
            fitPageToWidth: true,
          }}
          positionTitle={`1.${indexChar(length)}`}
          positions={positions}
          style={{flex: 1, color: '#267AD4'}}
          positionColor="#008000"
          onPositionsChanged={({nativeEvent}) => {
            setLength((l) => l + 1);
            setPositions((positions) =>
              positions.some((page) => page.page === nativeEvent.page)
                ? positions.map((page) =>
                    page.page === nativeEvent.page ? nativeEvent : page,
                  )
                : positions.concat(nativeEvent),
            );

            console.log({data: JSON.stringify(nativeEvent)});
          }}
        />
      </View>
    </View>
  );
};

export default YourApp;

const CONFIGURATION_IMAGE_DOCUMENT = {
  showPageNumberOverlay: false,
  showPageLabels: false,
  showThumbnailBar: 'none',
  editableAnnotationTypes: ['Square', 'Circle', 'Line', 'FreeText'],
};

async function requestExternalStoragePermissionImage() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write external storage permission granted');
      PSPDFKit.presentImage(DOCUMENT_IMAGE, CONFIGURATION_IMAGE_DOCUMENT);
    } else {
      console.log('Write external storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

async function requestExternalStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write external storage permission granted');
      PSPDFKit.present(DOCUMENT, CONFIGURATION);
    } else {
      console.log('Write external storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
