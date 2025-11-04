const frontendConfig = require('./frontend/app.json');

const prefixAssetPath = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') {
    return assetPath;
  }

  if (assetPath.startsWith('./frontend/')) {
    return assetPath;
  }

  const normalized = assetPath.startsWith('./')
    ? assetPath.slice(2)
    : assetPath;

  return `./frontend/${normalized}`;
};

module.exports = () => {
  const expoConfig = frontendConfig.expo ?? {};
  const androidConfig = expoConfig.android ?? {};
  const adaptiveIconConfig = androidConfig.adaptiveIcon ?? {};
  const webConfig = expoConfig.web ?? {};
  const extraConfig = expoConfig.extra ?? {};
  const routerExtraConfig = extraConfig.router ?? {};
  const plugins = (expoConfig.plugins ?? []).map((plugin) => {
    if (!Array.isArray(plugin)) {
      if (plugin === 'expo-router') {
        return ['expo-router', { root: './frontend/app' }];
      }
      return plugin;
    }

    const [pluginName, pluginOptions] = plugin;
    if (pluginName === 'expo-router') {
      return [
        pluginName,
        {
          ...(pluginOptions ?? {}),
          root: './frontend/app',
        },
      ];
    }
    if (pluginName !== 'expo-splash-screen' || !pluginOptions) {
      return plugin;
    }

    return [
      pluginName,
      {
        ...pluginOptions,
        image: prefixAssetPath(pluginOptions.image),
      },
    ];
  });

  return {
    ...frontendConfig,
    expo: {
      ...expoConfig,
      icon: prefixAssetPath(expoConfig.icon),
      android: {
        ...androidConfig,
        adaptiveIcon: {
          ...adaptiveIconConfig,
          foregroundImage: prefixAssetPath(adaptiveIconConfig.foregroundImage),
          backgroundImage: prefixAssetPath(adaptiveIconConfig.backgroundImage),
          monochromeImage: prefixAssetPath(adaptiveIconConfig.monochromeImage),
        },
      },
      web: {
        ...webConfig,
        favicon: prefixAssetPath(webConfig.favicon),
      },
      extra: {
        ...extraConfig,
        router: {
          ...routerExtraConfig,
          root: './frontend/app',
        },
      },
      plugins,
    },
    expoRouter: {
      ...(frontendConfig.expoRouter ?? {}),
      root: './frontend/app',
    },
  };
};
