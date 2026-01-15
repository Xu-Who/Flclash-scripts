function main(config) {
  const ICON_BASE = "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/";
  const RULE_BASE = "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/";

  const originalProxies = config.proxies || [];

  if (originalProxies.length === 0) return config;

  const filteredProxies = originalProxies;

  const REGIONS = [
    { name: "美国节点", pattern: "美|纽约|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣克拉拉|圣何塞|西雅图|芝加哥|US|United States|SJC", icon: "United_States.png" },
    { name: "日本节点", pattern: "日本|东京|大阪|JP|Japan", icon: "Japan.png" },
    { name: "狮城节点", pattern: "新加坡|狮城|SG|Singapore|SIN", icon: "Singapore.png" },
    { name: "香港节点", pattern: "港|HK|Hong Kong", icon: "Hong_Kong.png" },
    { name: "台湾节点", pattern: "台|新北|彰化|TW|Taiwan", icon: "Taiwan.png" }
  ];

  const validRegions = [];
  for (const region of REGIONS) {
    const regex = new RegExp(region.pattern);
    if (filteredProxies.some(proxy => regex.test(proxy.name))) {
      validRegions.push(region);
    }
  }

  const validRegionNames = validRegions.map(r => r.name);

  // 提取机场分组
  const airportRegex = /【([^】]+)】/;
  const airportMap = new Map();

  for (const proxy of filteredProxies) {
    const match = proxy.name.match(airportRegex);
    if (match) {
      const airportName = `【${match[1]}】`;
      if (!airportMap.has(airportName)) {
        airportMap.set(airportName, []);
      }
      airportMap.get(airportName).push(proxy.name);
    }
  }

  const airportNames = Array.from(airportMap.keys());
  const proxyGroups = [];

  proxyGroups.push({
    name: "节点选择",
    icon: `${ICON_BASE}Proxy.png`,
    type: "select",
    proxies: [...validRegionNames, ...airportNames, "手动切换"]
  });

  for (const region of validRegions) {
    const regex = new RegExp(region.pattern);
    const regionProxies = filteredProxies
      .filter(proxy => regex.test(proxy.name))
      .map(proxy => proxy.name);

    if (regionProxies.length > 0) {
      proxyGroups.push({
        name: region.name,
        icon: `${ICON_BASE}${region.icon}`,
        type: "url-test",
        proxies: regionProxies,
        interval: 300,
        tolerance: 50
      });
    }
  }

  proxyGroups.push({
    name: "手动切换",
    icon: `${ICON_BASE}Available.png`,
    "include-all": true,
    type: "select"
  });

  // 添加机场分组
  for (const [airportName, proxies] of airportMap) {
    proxyGroups.push({
      name: airportName,
      icon: `${ICON_BASE}Airport.png`,
      type: "url-test",
      proxies: proxies,
      interval: 300,
      tolerance: 50
    });
  }

  proxyGroups.push({
    name: "GLOBAL",
    icon: `${ICON_BASE}Global.png`,
    type: "select",
    proxies: ["节点选择", ...validRegionNames, ...airportNames, "手动切换", "DIRECT"]
  });

  config["proxy-groups"] = proxyGroups;

  config["rule-providers"] = {
    applications: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt", path: "./ruleset/applications.yaml", behavior: "classical", interval: 86400, format: "yaml", type: "http" },
    private: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt", path: "./ruleset/private.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
    reject: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt", path: "./ruleset/reject.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
    BanAD: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list", path: "./ruleset/BanAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanProgramAD: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list", path: "./ruleset/BanProgramAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanEasyListChina: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list", path: "./ruleset/BanEasyListChina.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    EasyPrivacy: { url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyPrivacy.yaml", path: "./rules/EasyPrivacy.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
    AntiAD: { url: "https://anti-ad.net/clash.yaml", path: "./ruleset/anti-ad.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
    AWAvenue: { url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.yaml", path: "./ruleset/awavenue.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
    GoogleCN: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/GoogleCN.list", path: "./ruleset/GoogleCN.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    Apple: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list", path: "./ruleset/Apple.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    Microsoft: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Microsoft.list", path: "./ruleset/Microsoft.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    OneDrive: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/OneDrive.list", path: "./ruleset/OneDrive.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    AI: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/AI.list", path: "./ruleset/AI.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    Telegram: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list", path: "./ruleset/Telegram.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    Netflix: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Netflix.list", path: "./ruleset/Netflix.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    GoogleCNProxyIP: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/GoogleCNProxyIP.list", path: "./ruleset/GoogleCNProxyIP.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ProxyGFWlist: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list", path: "./ruleset/ProxyGFWlist.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ProxyLite: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list", path: "./ruleset/ProxyLite.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    tld_not_cn: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt", path: "./ruleset/tld-not-cn.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
    ChinaMedia: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaMedia.list", path: "./ruleset/ChinaMedia.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ChinaDomain: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list", path: "./ruleset/ChinaDomain.list", behavior: "domain", interval: 86400, format: "text", type: "http" },
    cncidr: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt", path: "./ruleset/cncidr.yaml", behavior: "ipcidr", interval: 86400, format: "yaml", type: "http" },
    Download: { url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list", path: "./ruleset/Download.list", behavior: "classical", interval: 86400, format: "text", type: "http" }
  };

  config["rules"] = [
    "RULE-SET,applications,DIRECT",
    "RULE-SET,private,DIRECT",
    "RULE-SET,reject,REJECT",
    "RULE-SET,BanAD,REJECT",
    "RULE-SET,BanProgramAD,REJECT",
    "RULE-SET,BanEasyListChina,REJECT",
    "RULE-SET,EasyPrivacy,REJECT",
    "RULE-SET,AntiAD,REJECT",
    "RULE-SET,AWAvenue,REJECT",
    "RULE-SET,GoogleCN,DIRECT",
    "RULE-SET,Apple,DIRECT",
    "RULE-SET,Microsoft,DIRECT",
    "RULE-SET,OneDrive,DIRECT",
    "RULE-SET,AI,节点选择",
    "RULE-SET,Telegram,节点选择",
    "RULE-SET,Netflix,节点选择",
    "RULE-SET,GoogleCNProxyIP,节点选择",
    "RULE-SET,ProxyGFWlist,节点选择",
    "RULE-SET,ProxyLite,节点选择",
    "RULE-SET,tld_not_cn,节点选择",
    "RULE-SET,ChinaMedia,DIRECT",
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,cncidr,DIRECT",
    "RULE-SET,Download,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ];

  config.proxies = originalProxies;
  return config;
}
