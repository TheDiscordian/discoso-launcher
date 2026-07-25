/**
 * Launches executables located in the bin folder of the launcher, such as
 * OpenAL and .NET Framework.
 */
class ExecutableInstaller {
  /**
   * @param {string} file The file to launch.
   * @param {Array<string>} options The options to pass to the installer.
   */
  run( file, options ) {
    return new Promise( ( resolve, reject ) => {
      // `cwd` only sets the CHILD's directory - the executable itself is resolved against the
      // launcher's own directory and PATH, so `bin` has to be part of the path we pass in.
      // `bin` sits beside the packaged executable, outside the asar.
      const path = require( 'path' );
      const binDir = path.join( path.dirname( require( 'electron' ).app.getPath( 'exe' ) ), 'bin' );
      const target = path.join( binDir, file );
      const spawnOptions = { cwd: binDir };
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
