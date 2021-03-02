import React, {Component} from 'react';
import {
  StyleSheet,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';

const PSPDFKit = NativeModules.PSPDFKit;

const DOCUMENT = 'file:///sdcard/document.pdf';
const DOCUMENT_IMAGE = 'file:///sdcard/image.jpg';
const CONFIGURATION = {
  scrollContinuously: false,
  showPageNumberOverlay: true,
  pageScrollDirection: 'vertical',
};

// Change 'YourApp' to your app's name.
export default class YourApp extends Component<{}> {
  _onPressButton() {
    requestExternalStoragePermission();
  }

  _onPressButtonImage() {
    requestExternalStoragePermissionImage();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{PSPDFKit.versionString}</Text>
        <TouchableOpacity onPress={this._onPressButton}>
          <Text style={styles.text}>Tap to Open Document</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._onPressButtonImage}>
          <Text style={styles.text}>Tap to Open Image</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
