/**
 * Launches executables located in the bin folder of the launcher, such as
 * OpenAL and .NET Framework.
 */
class ExecutableInstaller {
  /**
   * @param {string} file The file to launch.
   * @param {Array<string>} options The options to pass to the installer.
   */
  async run( file, options ) {
    // `cwd` only sets the CHILD's directory - the executable itself is resolved against the
    // launcher's own directory and PATH, so `bin` has to be part of the path we pass in.
    // `bin` sits beside the packaged executable, outside the asar.
    const path = require( 'path' );
    const fs = require( 'fs-extra' );
    const os = require( 'os' );
    const binDir = path.join( path.dirname( require( 'electron' ).app.getPath( 'exe' ) ), 'bin' );
    const source = path.join( binDir, file );

    // Run from a temp copy. The launcher may live somewhere the OS refuses to execute from -
    // Documents is protected by Controlled Folder Access, and under OneDrive the file may be a
    // cloud placeholder rather than real bytes. Copying gives us a local, runnable file.
    let target = source;
    try {
      const tempDir = await fs.mkdtemp( path.join( os.tmpdir(), 'discoso-' ) );
      target = path.join( tempDir, file );
      await fs.copy( source, target );
    } catch ( err ) {
      console.error( 'could not stage installer in temp, running in place', err );
      target = source;
    }

    return new Promise( ( resolve, reject ) => {
      const spawnOptions = { cwd: path.dirname( target ) };
      const args = options || [];
      const child = require( 'child_process' ).spawn( target, args, spawnOptions );
      console.info( 'executing', { file, args, spawnOptions } );
      child.on( 'close', code => {
        console.info( file, { args, spawnOptions, code } );
        resolve();
      } );
      child.on( 'error', err => {
        console.info( file, { args, spawnOptions, err } );
        reject( err );
      } );
      child.stderr.on( 'data', data => console.error( file, { args, spawnOptions, data } ) );
      child.stdout.on( 'data', data => console.info( file, { args, spawnOptions, data } ) );
    } );
  }
}

module.exports = ExecutableInstaller;
