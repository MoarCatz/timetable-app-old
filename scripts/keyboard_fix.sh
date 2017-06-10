# Fixes the keyboard resizing the viewport
sudo sed -i 's/android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"/android:configChanges="orientation|keyboardHidden|screenSize|locale"/g' platforms/android/AndroidManifest.xml
sudo sed -i 's/android:windowSoftInputMode="adjustResize"/android:windowSoftInputMode="adjustPan"/g' platforms/android/AndroidManifest.xml
