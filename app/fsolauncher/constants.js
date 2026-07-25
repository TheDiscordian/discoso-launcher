const os = require( 'os' );
const packageJson = require( '../package.json' );
const linuxDistro = ( () => {
  if ( process.platform !== 'linux' )
    return { id: null, like: null };

  try {
    const osReleasePath = require( 'path' ).join( '/etc', 'os-release' );
    const data = require( 'fs-extra' ).readFileSync( osReleasePath, 'utf8' );
    const lines = data.split( '\n' );
    const idLine = lines.find( line => line.startsWith( 'ID=' ) );
    const likeLine = lines.find( line => line.startsWith( 'ID_LIKE=' ) );

    const distroId = idLine ? idLine.split( '=' )[ 1 ].trim().replace( /"/g, '' ).toLowerCase() : null;
    const distroLike = likeLine ? likeLine.split( '=' )[ 1 ].trim().replace( /"/g, '' ).toLowerCase() : null;

    return { id: distroId, like: distroLike };
  } catch ( err ) {
    console.error( 'error reading os-release to determine distro', err );
    return { id: null, like: null };
  }
} )();
const isArch = linuxDistro.id === 'arch' || linuxDistro.like === 'arch';
const isDebian = linuxDistro.id === 'debian' || linuxDistro.like === 'debian';
const linuxLibPath = ( () => {
  if ( isArch ) return '/usr/lib'; // Arch/CachyOS: libs live in /usr/lib, not a Debian multiarch subdir
  const arch = os.arch();
  switch ( arch ) {
  case 'x64':
    return '/usr/lib/x86_64-linux-gnu';
  case 'ia32':
  case 'x32':
    return '/usr/lib/i386-linux-gnu';
  case 'arm':
    return '/usr/lib/arm-linux-gnueabihf';
  case 'arm64':
    return '/usr/lib/aarch64-linux-gnu';
  default:
    console.warn( `Unsupported architecture: ${arch}` );
    return '/usr/lib';
  }
} )();
const homeDir = os.homedir();
const appData = ( () => {
  if ( process.platform === 'darwin' ) {
    return `${homeDir}/Library/Application Support/DiscoSO Launcher`;
  }
  if ( process.platform === 'linux' ) {
    return `${homeDir}/.fsolauncher`;
  }
  return '.';
} )();
// on Linux both launchers share ~/.fsolauncher, and FSOLauncher.ini is FreeSO Launcher's
// file - writing it there means the two overwrite each other's settings and LocalRegistry
const settingsPath = `${appData}/DiscoSOLauncher.ini`;
const legacySettingsPath = `${appData}/FSOLauncher.ini`;
const gameLanguages = {
  English: 0,
  French: 3,
  German: 4,
  Italian: 5,
  Spanish: 6,
  Dutch: 7,
  Danish: 8,
  Swedish: 9,
  Norwegian: 10,
  Finish: 11,
  Hebrew: 12,
  Russian: 13,
  Portuguese: 14,
  Japanese: 15,
  Polish: 16,
  SimplifiedChinese: 17,
  TraditionalChinese: 18,
  Thai: 19,
  Korean: 20,

  //begin freeso
  Slovak: 21
};
const isTestMode = process.argv.indexOf( '--fl-test-mode' ) !== -1;
const fileLogEnabled = process.argv.indexOf( '--fl-filelog' ) !== -1;
const devToolsEnabled = process.argv.indexOf( '--fl-devtools' ) !== -1;
const version = packageJson.version;
const defaultRefreshRate = 60;
const defaultGameLanguage = 'English';
const dependencies = {
  'FSO': [ 'TSO', ...( [ 'darwin', 'linux' ].includes( process.platform ) ? [ 'Mono', 'SDL' ] : [ 'OpenAL' ] ) ],
  'RMS': [ 'FSO' ],
  'MacExtras': [ 'FSO' ],
  'Simitone': ( [ 'darwin', 'linux' ].includes( process.platform ) ) ? [ 'Mono', 'SDL' ] : []
};
const needInternet = [
  'TSO',
  'FSO',
  'RMS',
  'Simitone',
  'Mono',
  'MacExtras',
  'SDL'
];
const darkThemes = [
  'halloween', 'dark', 'indigo'
];
const components = {
  'TSO': 'The Sims Online',
  'FSO': 'DiscoSO',
  'OpenAL': 'OpenAL',
  'NET': '.NET Framework',
  'RMS': 'Remesh Package',
  'Simitone': 'Simitone for Windows',
  'Mono': 'Mono Runtime',
  'MacExtras': 'DiscoSO MacExtras',
  'SDL': 'SDL2'
};
const versionChecks = {
  remeshPackageUrl: 'https://tso.thedisco.zone/launcher/RemeshPackage',
  updatesUrl: 'https://tso.thedisco.zone/launcher/UpdateCheck',
  interval: 5 * 60 * 1000 // every 5 minutes
};
const links = {
  updateWizardUrl: 'https://tso.thedisco.zone/#play',
  repoNewIssueUrl: 'https://github.com/TheDiscordian/discoso-launcher/issues/new',
  repoViewIssuesUrl: 'https://github.com/TheDiscordian/discoso-launcher/issues',
  repoDocsUrl: 'https://github.com/TheDiscordian/discoso-launcher',
  repoUrl: 'https://github.com/TheDiscordian/discoso-launcher',
};
const releases = {
  simitoneUrl: 'https://api.github.com/repos/riperiperi/Simitone/releases/latest',
  fsoGithubUrl: '', // DiscoSO ships the client from resourceCentral.DiscoSO
  fsoApiUrl: '',
};
const resourceCentral = {
  'TheSimsOnline': 'https://archive.org/download/tso-fileplanet/TSO_Installer_v1.1239.1.0.zip',
  'DiscoSO': 'https://tso.thedisco.zone/site/downloads/freeso-client.zip',
  '3DModels': 'https://tso.thedisco.zone/launcher/remeshes.zip',
  'Simitone': '',
  'Mono': 'https://download.mono-project.com/archive/6.12.0/macos-10-universal/MonoFramework-MDK-6.12.0.206.macos10.xamarin.universal.pkg',
  'MacExtras': 'https://tso.thedisco.zone/launcher/macextras.zip',
  'SDL': 'https://github.com/libsdl-org/SDL/releases/download/release-2.30.9/SDL2-2.30.9.dmg',
  'WS': '',
  'TrendingLots': 'https://tso.thedisco.zone/launcher/TrendingLots',
  'Scenarios': 'https://tso.thedisco.zone/launcher/Scenarios',
  'Blog': 'https://tso.thedisco.zone/launcher/Blog'
};
const temp = {
  'FSO': `${appData}/temp/artifacts-freeso-%s.zip`,
  'MacExtras': `${appData}/temp/macextras-%s.zip`,
  'Mono': `${appData}/temp/mono-%s.pkg`,
  'RMS': `${appData}/temp/artifacts-remeshes-%s.zip`,
  'SDL': `${appData}/temp/sdl2-%s.dmg`,
  'Simitone': `${appData}/temp/artifacts-simitone-%s.zip`,
  'TSO': {
    path: `${appData}/temp/tsoclient`,
    file: 'client.zip',
    extractionFolder: 'client',
    firstCab: 'TSO_Installer_v1.1239.1.0/Data1.cab',
    rootCab: 'Data1.cab'
  }
};
const registry = {
  ociName: 'DiscoSO Game',
  paths: {
    'TSO': process.platform === 'win32' ?
      'HKLM\\SOFTWARE\\Maxis\\The Sims Online' :
      `${appData}/GameComponents/The Sims Online/TSOClient/TSOClient.exe`,

    // our own key: FreeSO Launcher owns Rhys Simpson\FreeSO, and both writing it means
    // whichever installed last owns the other's install pointer
    'FSO': process.platform === 'win32' ?
      'HKLM\\SOFTWARE\\TheDiscordian\\DiscoSO' : `${appData}/GameComponents/DiscoSO/FreeSO.exe`,

    'TS1': process.platform === 'win32' ?
      'HKLM\\SOFTWARE\\Maxis\\The Sims' : `${appData}/GameComponents/The Sims/Sims.exe`,

    'Simitone': process.platform === 'win32' ?
      'HKLM\\SOFTWARE\\Rhys Simpson\\Simitone' :
      `${appData}/GameComponents/Simitone for Windows/Simitone.Windows.exe`,

    'OpenAL': 'HKLM\\SOFTWARE\\OpenAL',
    'NET': 'HKLM\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP',
    'Mono': process.platform === 'darwin' ? '/Library/Frameworks/Mono.framework' : '/usr/bin/mono',
    'SDL': process.platform === 'darwin' ? '/Library/Frameworks/SDL2.framework' : `${linuxLibPath}/libSDL2-2.0.so.0`
  },
  fallbacks: process.platform === 'win32' ? {
    // Windows fallbacks
    'TSO': [
      'C:/Program Files/Maxis/The Sims Online/TSOClient/TSOClient.exe',
      'C:/Program Files/The Sims Online/TSOClient/TSOClient.exe',
      'C:/Program Files/DiscoSO Game/The Sims Online/TSOClient/TSOClient.exe'
    ],
    'FSO': [
      'C:/Program Files/DiscoSO/FreeSO.exe',
      'C:/Program Files/DiscoSO Game/FreeSO/FreeSO.exe'
    ],
    'Simitone': [
      'C:/Program Files/Simitone for Windows/Simitone.Windows.exe',
      'C:/Program Files (x86)/Simitone for Windows/Simitone.Windows.exe'
    ],
    'OpenAL': [
      'C:/Program Files (x86)/OpenAL'
    ],
    'TS1': [
      'C:/Program Files (x86)/Maxis/The Sims'
    ]
  } : {
    // macOS fallbacks
    'TSO': [
      `${appData}/GameComponents/The Sims Online/TSOClient/TSOClient.exe`,
      `${homeDir}/Documents/The Sims Online/TSOClient/TSOClient.exe`,
    ],
    'FSO': [
      `${appData}/GameComponents/DiscoSO/FreeSO.exe`,
      `${homeDir}/Documents/DiscoSO/FreeSO.exe`,
    ],
    'Simitone': [
      `${appData}/GameComponents/Simitone for Windows/Simitone.Windows.exe`,
      `${homeDir}/Documents/Simitone for Windows/Simitone.Windows.exe`,
    ],
    'TS1': [
      `${appData}/GameComponents/The Sims`,
      `${homeDir}/Documents/The Sims`
    ]
  }
};

module.exports = {
  homeDir,
  appData,
  settingsPath,
  legacySettingsPath,
  gameLanguages,
  isTestMode,
  fileLogEnabled,
  devToolsEnabled,
  version,
  defaultRefreshRate,
  defaultGameLanguage,
  dependencies,
  needInternet,
  darkThemes,
  components,
  versionChecks,
  links,
  releases,
  resourceCentral,
  temp,
  registry,
  linuxDistro,
  linuxLibPath,
  isArch,
  isDebian
};
