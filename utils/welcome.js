const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const config = require('../config');

async function generateWelcomeImage(member) {
  const width = 1024;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = config.welcome.imageBackground;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = config.welcome.imageTextColor;
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('مرحباً بك!', width / 2, 80);

  ctx.font = '36px sans-serif';
  ctx.fillText(member.user.username, width / 2, 160);

  ctx.font = '24px sans-serif';
  ctx.fillText(`عضو رقم ${member.guild.memberCount}`, width / 2, 220);

  try {
    const avatar = await loadImage(
      member.user.displayAvatarURL({ extension: 'png', size: 256 })
    );
    const avSize = 120;
    const avX = width / 2 - avSize / 2;
    const avY = 250;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avX, avY, avSize, avSize);
    ctx.restore();
  } catch {
    // avatar optional
  }

  return canvas.toBuffer('image/png');
}

module.exports = { generateWelcomeImage };
