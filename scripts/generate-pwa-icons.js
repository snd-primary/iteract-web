/**
 * このスクリプトはSVGアイコンからPWA用のさまざまなサイズのPNGアイコンを生成します
 * 
 * 必要なパッケージ：
 * npm install --save-dev sharp svgexport
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

// 設定
const svgPath = path.join(__dirname, 'src/app/icon/icon.svg');
const outputDir = path.join(__dirname, 'public/icon');
const sizes = [192, 384, 512];

// 出力ディレクトリの作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 各サイズのアイコンを生成
async function generateIcons() {
  // SVGを一時的なPNGに変換（最大サイズ）
  const tempPngPath = path.join(outputDir, 'temp-icon.png');
  
  // サイズごとにPNGを生成
  for (const size of sizes) {
    try {
      // SVGを直接リサイズしてPNGとして保存
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size} icon:`, error);
    }
  }

  // Apple Touch Icon (152x152)を生成
  try {
    await sharp(svgPath)
      .resize(152, 152)
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    
    console.log('✅ Generated apple-touch-icon.png');
  } catch (error) {
    console.error('❌ Failed to generate apple-touch-icon.png:', error);
  }

  console.log('✅ All icons generated successfully!');
}

generateIcons().catch(console.error);