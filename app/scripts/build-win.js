const packager = require( '@electron/packager' ).packager,
  { execSync } = require( 'child_process' );

( async () => {
  try {
    await packager( {
      dir: '.',
      name: 'DiscoSO Launcher',
      out: '../release',
      platform: 'win32',
      arch: 'ia32',
      icon: './beta.ico',
      asar: {
        unpackDir: '{fsolauncher-ui/images,fsolauncher-ui/sounds,fsolauncher-ui/fonts}',
      },
      overwrite: true,
      appCopyright: 'DiscoSO. FreeSO is (C) its authors, MPL-2.0.',
      win32metadata: {
        CompanyName: 'DiscoSO',
        'requested-execution-level': 'requireAdministrator',
        FileDescription: 'DiscoSO Launcher',
      },
      derefSymlinks: true
    } );
    execSync( 'npm run copywin', { stdio: 'inherit' } );
    execSync( 'npm run compileiss', { stdio: 'inherit' } );
  } catch ( err ) {
    console.error( err );
    process.exitCode = 1;
  }
} )();