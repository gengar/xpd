// ==UserScript==
// @name           xpd
// @namespace      gengar.hatenadiary.org
// @description    GLCのパーティ構築システムの一括変更を使いやすくするスクリプト
// @include        http://psense.lib.net/_/PDINPUT.cgi*
// @grant          unsafeWindow
// @grant          GM.xmlHttpRequest
// @grant          GM.getValue
// @grant          GM.setValue
// ==/UserScript==

/*
 *   Copyright (C) 2009-2023, kaki
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *   1. Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *   TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

if (!document.forms[0]?.S2) {
  throw new Error("一括変更のページでないため実行を中断");
}

const xpd = {
  version: "2.0.0-beta"
};

function exportUnsafe(f) {
  return (typeof exportFunction === "undefined")
    ? f
    : exportFunction(f, unsafeWindow, { defineAs: f.name });
}

function getWrappedJSObject(obj) {
  return obj.wrappedJSObject ?? obj;
}

const $w = getWrappedJSObject(window);
const $d = getWrappedJSObject(document);
const $f = getWrappedJSObject(document.forms[0]);

$d.title += "/xpd";

xpd.platforms = ["Mac OS X", "Windows"];
xpd.platform = xpd.platforms.find(s => navigator.userAgent.indexOf(s) >= 0);
xpd.browsers = ["Firefox", "Chrome"];
xpd.browser = xpd.browsers.find(s => navigator.userAgent.indexOf(s) >= 0);

xpd.pref = {};

// --- Data ---
class PokeData {
  constructor(name, hp, spd, female) {
    this.name = name;
    this.hp = hp;
    this.spd = spd;
    this.female = female;
  }
}

const pokelist = new Array;
pokelist[1] = new PokeData("フシギダネ", 45, 45, 2);
pokelist[2] = new PokeData("フシギソウ", 60, 60, 2);
pokelist[3] = new PokeData("フシギバナ", 80, 80, 2);
pokelist[4] = new PokeData("ヒトカゲ", 39, 65, 2);
pokelist[5] = new PokeData("リザード", 58, 80, 2);
pokelist[6] = new PokeData("リザードン", 78, 100, 2);
pokelist[7] = new PokeData("ゼニガメ", 44, 43, 2);
pokelist[8] = new PokeData("カメール", 59, 58, 2);
pokelist[9] = new PokeData("カメックス", 79, 78, 2);
pokelist[10] = new PokeData("キャタピー", 45, 45, 8);
pokelist[11] = new PokeData("トランセル", 50, 30, 8);
pokelist[12] = new PokeData("バタフリー", 60, 70, 8);
pokelist[13] = new PokeData("ビードル", 40, 50, 8);
pokelist[14] = new PokeData("コクーン", 45, 35, 8);
pokelist[15] = new PokeData("スピアー", 65, 75, 8);
pokelist[16] = new PokeData("ポッポ", 40, 56, 8);
pokelist[17] = new PokeData("ピジョン", 63, 71, 8);
pokelist[18] = new PokeData("ピジョット", 83, 91, 8);
pokelist[19] = new PokeData("コラッタ", 30, 72, 8);
pokelist[20] = new PokeData("ラッタ", 55, 97, 8);
pokelist[21] = new PokeData("オニスズメ", 40, 70, 8);
pokelist[22] = new PokeData("オニドリル", 65, 100, 8);
pokelist[23] = new PokeData("アーボ", 35, 55, 8);
pokelist[24] = new PokeData("アーボック", 60, 80, 8);
pokelist[25] = new PokeData("ピカチュウ", 35, 90, 8);
pokelist[26] = new PokeData("ライチュウ", 60, 100, 8);
pokelist[27] = new PokeData("サンド", 50, 40, 8);
pokelist[28] = new PokeData("サンドパン", 75, 65, 8);
pokelist[29] = new PokeData("ニドラン♀", 55, 41, 16);
pokelist[30] = new PokeData("ニドリーナ", 70, 56, 16);
pokelist[31] = new PokeData("ニドクイン", 90, 76, 16);
pokelist[32] = new PokeData("ニドラン♂", 46, 50, 0);
pokelist[33] = new PokeData("ニドリーノ", 61, 65, 0);
pokelist[34] = new PokeData("ニドキング", 81, 85, 0);
pokelist[35] = new PokeData("ピッピ", 70, 35, 12);
pokelist[36] = new PokeData("ピクシー", 95, 60, 12);
pokelist[37] = new PokeData("ロコン", 38, 65, 12);
pokelist[38] = new PokeData("キュウコン", 73, 100, 12);
pokelist[39] = new PokeData("プリン", 115, 20, 12);
pokelist[40] = new PokeData("プクリン", 140, 45, 12);
pokelist[41] = new PokeData("ズバット", 40, 55, 8);
pokelist[42] = new PokeData("ゴルバット", 75, 90, 8);
pokelist[43] = new PokeData("ナゾノクサ", 45, 30, 8);
pokelist[44] = new PokeData("クサイハナ", 60, 40, 8);
pokelist[45] = new PokeData("ラフレシア", 75, 50, 8);
pokelist[46] = new PokeData("パラス", 35, 25, 8);
pokelist[47] = new PokeData("パラセクト", 60, 30, 8);
pokelist[48] = new PokeData("コンパン", 60, 45, 8);
pokelist[49] = new PokeData("モルフォン", 70, 90, 8);
pokelist[50] = new PokeData("ディグダ", 10, 95, 8);
pokelist[51] = new PokeData("ダグトリオ", 35, 120, 8);
pokelist[52] = new PokeData("ニャース", 40, 90, 8);
pokelist[53] = new PokeData("ペルシアン", 65, 115, 8);
pokelist[54] = new PokeData("コダック", 50, 55, 8);
pokelist[55] = new PokeData("ゴルダック", 80, 85, 8);
pokelist[56] = new PokeData("マンキー", 40, 70, 8);
pokelist[57] = new PokeData("オコリザル", 65, 95, 8);
pokelist[58] = new PokeData("ガーディ", 55, 60, 4);
pokelist[59] = new PokeData("ウインディ", 90, 95, 4);
pokelist[60] = new PokeData("ニョロモ", 40, 90, 8);
pokelist[61] = new PokeData("ニョロゾ", 65, 90, 8);
pokelist[62] = new PokeData("ニョロボン", 90, 70, 8);
pokelist[63] = new PokeData("ケーシィ", 25, 90, 4);
pokelist[64] = new PokeData("ユンゲラー", 40, 105, 4);
pokelist[65] = new PokeData("フーディン", 55, 120, 4);
pokelist[66] = new PokeData("ワンリキー", 70, 35, 4);
pokelist[67] = new PokeData("ゴーリキー", 80, 45, 4);
pokelist[68] = new PokeData("カイリキー", 90, 55, 4);
pokelist[69] = new PokeData("マダツボミ", 50, 40, 8);
pokelist[70] = new PokeData("ウツドン", 65, 55, 8);
pokelist[71] = new PokeData("ウツボット", 80, 70, 8);
pokelist[72] = new PokeData("メノクラゲ", 40, 70, 8);
pokelist[73] = new PokeData("ドククラゲ", 80, 100, 8);
pokelist[74] = new PokeData("イシツブテ", 40, 20, 8);
pokelist[75] = new PokeData("ゴローン", 55, 35, 8);
pokelist[76] = new PokeData("ゴローニャ", 80, 45, 8);
pokelist[77] = new PokeData("ポニータ", 50, 90, 8);
pokelist[78] = new PokeData("ギャロップ", 65, 105, 8);
pokelist[79] = new PokeData("ヤドン", 90, 15, 8);
pokelist[80] = new PokeData("ヤドラン", 95, 30, 8);
pokelist[81] = new PokeData("コイル", 25, 45, -1);
pokelist[82] = new PokeData("レアコイル", 50, 70, -1);
pokelist[83] = new PokeData("カモネギ", 52, 60, 8);
pokelist[84] = new PokeData("ドードー", 35, 75, 8);
pokelist[85] = new PokeData("ドードリオ", 60, 100, 8);
pokelist[86] = new PokeData("パウワウ", 65, 45, 8);
pokelist[87] = new PokeData("ジュゴン", 90, 70, 8);
pokelist[88] = new PokeData("ベトベター", 80, 25, 8);
pokelist[89] = new PokeData("ベトベトン", 105, 50, 8);
pokelist[90] = new PokeData("シェルダー", 30, 40, 8);
pokelist[91] = new PokeData("パルシェン", 50, 70, 8);
pokelist[92] = new PokeData("ゴース", 30, 80, 8);
pokelist[93] = new PokeData("ゴースト", 45, 95, 8);
pokelist[94] = new PokeData("ゲンガー", 60, 110, 8);
pokelist[95] = new PokeData("イワーク", 35, 70, 8);
pokelist[96] = new PokeData("スリープ", 60, 42, 8);
pokelist[97] = new PokeData("スリーパー", 85, 67, 8);
pokelist[98] = new PokeData("クラブ", 30, 50, 8);
pokelist[99] = new PokeData("キングラー", 55, 75, 8);
pokelist[100] = new PokeData("ビリリダマ", 40, 100, -1);
pokelist[101] = new PokeData("マルマイン", 60, 140, -1);
pokelist[102] = new PokeData("タマタマ", 60, 40, 8);
pokelist[103] = new PokeData("ナッシー", 95, 55, 8);
pokelist[104] = new PokeData("カラカラ", 50, 35, 8);
pokelist[105] = new PokeData("ガラガラ", 60, 45, 8);
pokelist[106] = new PokeData("サワムラー", 50, 87, 0);
pokelist[107] = new PokeData("エビワラー", 50, 76, 0);
pokelist[108] = new PokeData("ベロリンガ", 90, 30, 8);
pokelist[109] = new PokeData("ドガース", 40, 35, 8);
pokelist[110] = new PokeData("マタドガス", 65, 60, 8);
pokelist[111] = new PokeData("サイホーン", 80, 25, 8);
pokelist[112] = new PokeData("サイドン", 105, 40, 8);
pokelist[113] = new PokeData("ラッキー", 250, 50, 16);
pokelist[114] = new PokeData("モンジャラ", 65, 60, 8);
pokelist[115] = new PokeData("ガルーラ", 105, 90, 16);
pokelist[116] = new PokeData("タッツー", 30, 60, 8);
pokelist[117] = new PokeData("シードラ", 55, 85, 8);
pokelist[118] = new PokeData("トサキント", 45, 63, 8);
pokelist[119] = new PokeData("アズマオウ", 80, 68, 8);
pokelist[120] = new PokeData("ヒトデマン", 30, 85, -1);
pokelist[121] = new PokeData("スターミー", 60, 115, -1);
pokelist[122] = new PokeData("バリヤード", 40, 90, 8);
pokelist[123] = new PokeData("ストライク", 70, 105, 8);
pokelist[124] = new PokeData("ルージュラ", 65, 95, 16);
pokelist[125] = new PokeData("エレブー", 65, 105, 4);
pokelist[126] = new PokeData("ブーバー", 65, 93, 4);
pokelist[127] = new PokeData("カイロス", 65, 85, 8);
pokelist[128] = new PokeData("ケンタロス", 75, 110, 0);
pokelist[129] = new PokeData("コイキング", 20, 80, 8);
pokelist[130] = new PokeData("ギャラドス", 95, 81, 8);
pokelist[131] = new PokeData("ラプラス", 130, 60, 8);
pokelist[132] = new PokeData("メタモン", 48, 48, -1);
pokelist[133] = new PokeData("イーブイ", 55, 55, 2);
pokelist[134] = new PokeData("シャワーズ", 130, 65, 2);
pokelist[135] = new PokeData("サンダース", 65, 130, 2);
pokelist[136] = new PokeData("ブースター", 65, 65, 2);
pokelist[137] = new PokeData("ポリゴン", 65, 40, -1);
pokelist[138] = new PokeData("オムナイト", 35, 35, 2);
pokelist[139] = new PokeData("オムスター", 70, 55, 2);
pokelist[140] = new PokeData("カブト", 30, 55, 2);
pokelist[141] = new PokeData("カブトプス", 60, 80, 2);
pokelist[142] = new PokeData("プテラ", 80, 130, 2);
pokelist[143] = new PokeData("カビゴン", 160, 30, 2);
pokelist[144] = new PokeData("フリーザー", 90, 85, -1);
pokelist[145] = new PokeData("サンダー", 90, 100, -1);
pokelist[146] = new PokeData("ファイヤー", 90, 90, -1);
pokelist[147] = new PokeData("ミニリュウ", 41, 50, 8);
pokelist[148] = new PokeData("ハクリュー", 61, 70, 8);
pokelist[149] = new PokeData("カイリュー", 91, 80, 8);
pokelist[150] = new PokeData("ミュウツー", 106, 130, -1);
pokelist[151] = new PokeData("ミュウ", 100, 100, -1);
pokelist[152] = new PokeData("チコリータ", 45, 45, 2);
pokelist[153] = new PokeData("ベイリーフ", 60, 60, 2);
pokelist[154] = new PokeData("メガニウム", 80, 80, 2);
pokelist[155] = new PokeData("ヒノアラシ", 39, 65, 2);
pokelist[156] = new PokeData("マグマラシ", 58, 80, 2);
pokelist[157] = new PokeData("バクフーン", 78, 100, 2);
pokelist[158] = new PokeData("ワニノコ", 50, 43, 2);
pokelist[159] = new PokeData("アリゲイツ", 65, 58, 2);
pokelist[160] = new PokeData("オーダイル", 85, 78, 2);
pokelist[161] = new PokeData("オタチ", 35, 20, 8);
pokelist[162] = new PokeData("オオタチ", 85, 90, 8);
pokelist[163] = new PokeData("ホーホー", 60, 50, 8);
pokelist[164] = new PokeData("ヨルノズク", 100, 70, 8);
pokelist[165] = new PokeData("レディバ", 40, 55, 8);
pokelist[166] = new PokeData("レディアン", 55, 85, 8);
pokelist[167] = new PokeData("イトマル", 40, 30, 8);
pokelist[168] = new PokeData("アリアドス", 70, 40, 8);
pokelist[169] = new PokeData("クロバット", 85, 130, 8);
pokelist[170] = new PokeData("チョンチー", 75, 67, 8);
pokelist[171] = new PokeData("ランターン", 125, 67, 8);
pokelist[172] = new PokeData("ピチュー", 20, 60, 8);
pokelist[173] = new PokeData("ピィ", 50, 15, 12);
pokelist[174] = new PokeData("ププリン", 90, 15, 12);
pokelist[175] = new PokeData("トゲピー", 35, 20, 2);
pokelist[176] = new PokeData("トゲチック", 55, 40, 2);
pokelist[177] = new PokeData("ネイティ", 40, 70, 8);
pokelist[178] = new PokeData("ネイティオ", 65, 95, 8);
pokelist[179] = new PokeData("メリープ", 55, 35, 8);
pokelist[180] = new PokeData("モココ", 70, 45, 8);
pokelist[181] = new PokeData("デンリュウ", 90, 55, 8);
pokelist[182] = new PokeData("キレイハナ", 75, 50, 8);
pokelist[183] = new PokeData("マリル", 70, 40, 8);
pokelist[184] = new PokeData("マリルリ", 100, 50, 8);
pokelist[185] = new PokeData("ウソッキー", 70, 30, 8);
pokelist[186] = new PokeData("ニョロトノ", 90, 70, 8);
pokelist[187] = new PokeData("ハネッコ", 35, 50, 8);
pokelist[188] = new PokeData("ポポッコ", 55, 80, 8);
pokelist[189] = new PokeData("ワタッコ", 75, 110, 8);
pokelist[190] = new PokeData("エイパム", 55, 85, 8);
pokelist[191] = new PokeData("ヒマナッツ", 30, 30, 8);
pokelist[192] = new PokeData("キマワリ", 75, 30, 8);
pokelist[193] = new PokeData("ヤンヤンマ", 65, 95, 8);
pokelist[194] = new PokeData("ウパー", 55, 15, 8);
pokelist[195] = new PokeData("ヌオー", 95, 35, 8);
pokelist[196] = new PokeData("エーフィ", 65, 110, 2);
pokelist[197] = new PokeData("ブラッキー", 95, 65, 2);
pokelist[198] = new PokeData("ヤミカラス", 60, 91, 8);
pokelist[199] = new PokeData("ヤドキング", 95, 30, 8);
pokelist[200] = new PokeData("ムウマ", 60, 85, 8);
pokelist[201] = new PokeData("アンノーン", 48, 48, -1);
pokelist[202] = new PokeData("ソーナンス", 190, 33, 8);
pokelist[203] = new PokeData("キリンリキ", 70, 85, 8);
pokelist[204] = new PokeData("クヌギダマ", 50, 15, 8);
pokelist[205] = new PokeData("フォレトス", 75, 40, 8);
pokelist[206] = new PokeData("ノコッチ", 100, 45, 8);
pokelist[207] = new PokeData("グライガー", 65, 85, 8);
pokelist[208] = new PokeData("ハガネール", 75, 30, 8);
pokelist[209] = new PokeData("ブルー", 60, 30, 12);
pokelist[210] = new PokeData("グランブル", 90, 45, 12);
pokelist[211] = new PokeData("ハリーセン", 65, 85, 8);
pokelist[212] = new PokeData("ハッサム", 70, 65, 8);
pokelist[213] = new PokeData("ツボツボ", 20, 5, 8);
pokelist[214] = new PokeData("ヘラクロス", 80, 85, 8);
pokelist[215] = new PokeData("ニューラ", 55, 115, 8);
pokelist[216] = new PokeData("ヒメグマ", 60, 40, 8);
pokelist[217] = new PokeData("リングマ", 90, 55, 8);
pokelist[218] = new PokeData("マグマッグ", 40, 20, 8);
pokelist[219] = new PokeData("マグカルゴ", 50, 30, 8);
pokelist[220] = new PokeData("ウリムー", 50, 50, 8);
pokelist[221] = new PokeData("イノムー", 100, 50, 8);
pokelist[222] = new PokeData("サニーゴ", 55, 35, 12);
pokelist[223] = new PokeData("テッポウオ", 35, 65, 8);
pokelist[224] = new PokeData("オクタン", 75, 45, 8);
pokelist[225] = new PokeData("デリバード", 45, 75, 8);
pokelist[226] = new PokeData("マンタイン", 65, 70, 8);
pokelist[227] = new PokeData("エアームド", 65, 70, 8);
pokelist[228] = new PokeData("デルビル", 45, 65, 8);
pokelist[229] = new PokeData("ヘルガー", 75, 95, 8);
pokelist[230] = new PokeData("キングドラ", 75, 85, 8);
pokelist[231] = new PokeData("ゴマゾウ", 90, 40, 8);
pokelist[232] = new PokeData("ドンファン", 90, 50, 8);
pokelist[233] = new PokeData("ポリゴン２", 85, 60, -1);
pokelist[234] = new PokeData("オドシシ", 73, 85, 8);
pokelist[235] = new PokeData("ドーブル", 55, 75, 8);
pokelist[236] = new PokeData("バルキー", 35, 35, 0);
pokelist[237] = new PokeData("カポエラー", 50, 70, 0);
pokelist[238] = new PokeData("ムチュール", 45, 65, 16);
pokelist[239] = new PokeData("エレキッド", 45, 95, 4);
pokelist[240] = new PokeData("ブビィ", 45, 83, 4);
pokelist[241] = new PokeData("ミルタンク", 95, 100, 16);
pokelist[242] = new PokeData("ハピナス", 255, 55, 16);
pokelist[243] = new PokeData("ライコウ", 90, 115, -1);
pokelist[244] = new PokeData("エンテイ", 115, 100, -1);
pokelist[245] = new PokeData("スイクン", 100, 85, -1);
pokelist[246] = new PokeData("ヨーギラス", 50, 41, 8);
pokelist[247] = new PokeData("サナギラス", 70, 51, 8);
pokelist[248] = new PokeData("バンギラス", 100, 61, 8);
pokelist[249] = new PokeData("ルギア", 106, 110, -1);
pokelist[250] = new PokeData("ホウオウ", 106, 90, -1);
pokelist[251] = new PokeData("セレビィ", 100, 100, -1);

class MoveData {
  constructor(name, pp) {
    this.name = name;
    this.pp = pp;
  }
}

const movelist = new Array;
movelist[0] = new MoveData("", 0);
movelist[2] = new MoveData("はたく", 35);
movelist[3] = new MoveData("からてチョップ", 25);
movelist[4] = new MoveData("おうふくビンタ", 20);
movelist[5] = new MoveData("れんぞくパンチ", 15);
movelist[6] = new MoveData("メガトンパンチ", 20);
movelist[7] = new MoveData("ネコにこばん", 20);
movelist[8] = new MoveData("ほのおのパンチ", 15);
movelist[9] = new MoveData("れいとうパンチ", 15);
movelist[10] = new MoveData("かみなりパンチ", 15);
movelist[11] = new MoveData("ひっかく", 35);
movelist[12] = new MoveData("はさむ", 30);
movelist[13] = new MoveData("ハサミギロチン", 5);
movelist[14] = new MoveData("かまいたち", 10);
movelist[15] = new MoveData("つるぎのまい", 30);
movelist[16] = new MoveData("いあいぎり", 30);
movelist[17] = new MoveData("かぜおこし", 35);
movelist[18] = new MoveData("つばさでうつ", 35);
movelist[19] = new MoveData("ふきとばし", 20);
movelist[20] = new MoveData("そらをとぶ", 15);
movelist[21] = new MoveData("しめつける", 20);
movelist[22] = new MoveData("たたきつける", 20);
movelist[23] = new MoveData("つるのムチ", 10);
movelist[24] = new MoveData("ふみつけ", 20);
movelist[25] = new MoveData("にどげり", 30);
movelist[26] = new MoveData("メガトンキック", 5);
movelist[27] = new MoveData("とびげり", 25);
movelist[28] = new MoveData("まわしげり", 15);
movelist[29] = new MoveData("すなかけ", 15);
movelist[30] = new MoveData("ずつき", 15);
movelist[31] = new MoveData("つのでつく", 25);
movelist[32] = new MoveData("みだれづき", 20);
movelist[33] = new MoveData("つのドリル", 5);
movelist[34] = new MoveData("たいあたり", 35);
movelist[35] = new MoveData("のしかかり", 15);
movelist[36] = new MoveData("まきつく", 20);
movelist[37] = new MoveData("とっしん", 20);
movelist[38] = new MoveData("あばれる", 20);
movelist[39] = new MoveData("すてみタックル", 15);
movelist[40] = new MoveData("しっぽをふる", 30);
movelist[41] = new MoveData("どくばり", 35);
movelist[42] = new MoveData("ダブルニードル", 20);
movelist[43] = new MoveData("ミサイルばり", 20);
movelist[44] = new MoveData("にらみつける", 30);
movelist[45] = new MoveData("かみつく", 25);
movelist[46] = new MoveData("なきごえ", 40);
movelist[47] = new MoveData("ほえる", 20);
movelist[48] = new MoveData("うたう", 15);
movelist[49] = new MoveData("ちょうおんぱ", 20);
movelist[50] = new MoveData("ソニックブーム", 20);
movelist[51] = new MoveData("かなしばり", 20);
movelist[52] = new MoveData("ようかいえき", 30);
movelist[53] = new MoveData("ひのこ", 25);
movelist[54] = new MoveData("かえんほうしゃ", 15);
movelist[55] = new MoveData("しろいきり", 30);
movelist[56] = new MoveData("みずでっぽう", 25);
movelist[57] = new MoveData("ハイドロポンプ", 5);
movelist[58] = new MoveData("なみのり", 15);
movelist[59] = new MoveData("れいとうビーム", 10);
movelist[60] = new MoveData("ふぶき", 5);
movelist[61] = new MoveData("サイケこうせん", 20);
movelist[62] = new MoveData("バブルこうせん", 20);
movelist[63] = new MoveData("オーロラビーム", 20);
movelist[64] = new MoveData("はかいこうせん", 5);
movelist[65] = new MoveData("つつく", 35);
movelist[66] = new MoveData("ドリルくちばし", 20);
movelist[67] = new MoveData("じごくぐるま", 25);
movelist[68] = new MoveData("けたぐり", 20);
movelist[69] = new MoveData("カウンター", 20);
movelist[70] = new MoveData("ちきゅうなげ", 20);
movelist[71] = new MoveData("かいりき", 15);
movelist[72] = new MoveData("すいとる", 20);
movelist[73] = new MoveData("メガドレイン", 10);
movelist[74] = new MoveData("やどりぎのタネ", 10);
movelist[75] = new MoveData("せいちょう", 40);
movelist[76] = new MoveData("はっぱカッター", 25);
movelist[77] = new MoveData("ソーラービーム", 10);
movelist[78] = new MoveData("どくのこな", 35);
movelist[79] = new MoveData("しびれごな", 30);
movelist[80] = new MoveData("ねむりごな", 15);
movelist[81] = new MoveData("はなびらのまい", 20);
movelist[82] = new MoveData("いとをはく", 40);
movelist[83] = new MoveData("りゅうのいかり", 10);
movelist[84] = new MoveData("ほのおのうず", 15);
movelist[85] = new MoveData("でんきショック", 30);
movelist[86] = new MoveData("１０まんボルト", 15);
movelist[87] = new MoveData("でんじは", 20);
movelist[88] = new MoveData("かみなり", 10);
movelist[89] = new MoveData("いわおとし", 15);
movelist[90] = new MoveData("じしん", 10);
movelist[91] = new MoveData("じわれ", 5);
movelist[92] = new MoveData("あなをほる", 10);
movelist[93] = new MoveData("どくどく", 10);
movelist[94] = new MoveData("ねんりき", 25);
movelist[95] = new MoveData("サイコキネシス", 10);
movelist[96] = new MoveData("さいみんじゅつ", 20);
movelist[97] = new MoveData("ヨガのポーズ", 40);
movelist[98] = new MoveData("こうそくいどう", 30);
movelist[99] = new MoveData("でんこうせっか", 30);
movelist[100] = new MoveData("いかり", 20);
movelist[101] = new MoveData("テレポート", 20);
movelist[102] = new MoveData("ナイトヘッド", 15);
movelist[103] = new MoveData("ものまね", 10);
movelist[104] = new MoveData("いやなおと", 40);
movelist[105] = new MoveData("かげぶんしん", 15);
movelist[106] = new MoveData("じこさいせい", 20);
movelist[107] = new MoveData("かたくなる", 30);
movelist[108] = new MoveData("ちいさくなる", 20);
movelist[109] = new MoveData("えんまく", 20);
movelist[110] = new MoveData("あやしいひかり", 15);
movelist[111] = new MoveData("からにこもる", 40);
movelist[112] = new MoveData("まるくなる", 40);
movelist[113] = new MoveData("バリアー", 30);
movelist[114] = new MoveData("ひかりのかべ", 30);
movelist[115] = new MoveData("くろいきり", 30);
movelist[116] = new MoveData("リフレクター", 20);
movelist[117] = new MoveData("きあいだめ", 30);
movelist[118] = new MoveData("がまん", 10);
movelist[119] = new MoveData("ゆびをふる", 10);
movelist[120] = new MoveData("オウムがえし", 20);
movelist[121] = new MoveData("じばく", 5);
movelist[122] = new MoveData("タマゴばくだん", 10);
movelist[123] = new MoveData("したでなめる", 30);
movelist[124] = new MoveData("スモッグ", 20);
movelist[125] = new MoveData("ヘドロこうげき", 20);
movelist[126] = new MoveData("ホネこんぼう", 20);
movelist[127] = new MoveData("だいもんじ", 5);
movelist[128] = new MoveData("たきのぼり", 15);
movelist[129] = new MoveData("からではさむ", 10);
movelist[130] = new MoveData("スピードスター", 20);
movelist[131] = new MoveData("ロケットずつき", 15);
movelist[132] = new MoveData("とげキャノン", 15);
movelist[133] = new MoveData("からみつく", 35);
movelist[134] = new MoveData("ドわすれ", 20);
movelist[135] = new MoveData("スプーンまげ", 15);
movelist[136] = new MoveData("タマゴうみ", 10);
movelist[137] = new MoveData("とびひざげり", 20);
movelist[138] = new MoveData("へびにらみ", 30);
movelist[139] = new MoveData("ゆめくい", 15);
movelist[140] = new MoveData("どくガス", 40);
movelist[141] = new MoveData("たまなげ", 20);
movelist[142] = new MoveData("きゅうけつ", 15);
movelist[143] = new MoveData("あくまのキッス", 10);
movelist[144] = new MoveData("ゴッドバード", 5);
movelist[145] = new MoveData("へんしん", 10);
movelist[146] = new MoveData("あわ", 30);
movelist[147] = new MoveData("ピヨピヨパンチ", 10);
movelist[148] = new MoveData("キノコのほうし", 15);
movelist[149] = new MoveData("フラッシュ", 20);
movelist[150] = new MoveData("サイコウェーブ", 15);
movelist[151] = new MoveData("はねる", 40);
movelist[152] = new MoveData("とける", 40);
movelist[153] = new MoveData("クラブハンマー", 10);
movelist[154] = new MoveData("だいばくはつ", 5);
movelist[155] = new MoveData("みだれひっかき", 15);
movelist[156] = new MoveData("ホネブーメラン", 10);
movelist[157] = new MoveData("ねむる", 10);
movelist[158] = new MoveData("いわなだれ", 10);
movelist[159] = new MoveData("ひっさつまえば", 15);
movelist[160] = new MoveData("かくばる", 30);
movelist[161] = new MoveData("テクスチャー", 30);
movelist[162] = new MoveData("トライアタック", 10);
movelist[163] = new MoveData("いかりのまえば", 10);
movelist[164] = new MoveData("きりさく", 20);
movelist[165] = new MoveData("みがわり", 10);
movelist[166] = new MoveData("わるあがき", -1);
movelist[167] = new MoveData("スケッチ", 1);
movelist[168] = new MoveData("トリプルキック", 10);
movelist[169] = new MoveData("どろぼう", 10);
movelist[170] = new MoveData("クモのす", 15);
movelist[171] = new MoveData("こころのめ", 5);
movelist[172] = new MoveData("あくむ", 15);
movelist[173] = new MoveData("かえんぐるま", 25);
movelist[174] = new MoveData("いびき", 15);
movelist[175] = new MoveData("のろい", 10);
movelist[176] = new MoveData("じたばた", 15);
movelist[177] = new MoveData("テクスチャー２", 30);
movelist[178] = new MoveData("エアロブラスト", 5);
movelist[179] = new MoveData("わたほうし", 40);
movelist[180] = new MoveData("きしかいせい", 15);
movelist[181] = new MoveData("うらみ", 10);
movelist[182] = new MoveData("こなゆき", 25);
movelist[183] = new MoveData("まもる", 10);
movelist[184] = new MoveData("マッハパンチ", 30);
movelist[185] = new MoveData("こわいかお", 10);
movelist[186] = new MoveData("だましうち", 20);
movelist[187] = new MoveData("てんしのキッス", 10);
movelist[188] = new MoveData("はらだいこ", 10);
movelist[189] = new MoveData("ヘドロばくだん", 10);
movelist[190] = new MoveData("どろかけ", 10);
movelist[191] = new MoveData("オクタンほう", 10);
movelist[192] = new MoveData("まきびし", 20);
movelist[193] = new MoveData("でんじほう", 5);
movelist[194] = new MoveData("みやぶる", 40);
movelist[195] = new MoveData("みちづれ", 5);
movelist[196] = new MoveData("ほろびのうた", 5);
movelist[197] = new MoveData("こごえるかぜ", 15);
movelist[198] = new MoveData("みきり", 5);
movelist[199] = new MoveData("ボーンラッシュ", 10);
movelist[200] = new MoveData("ロックオン", 5);
movelist[201] = new MoveData("げきりん", 15);
movelist[202] = new MoveData("すなあらし", 10);
movelist[203] = new MoveData("ギガドレイン", 5);
movelist[204] = new MoveData("こらえる", 10);
movelist[205] = new MoveData("あまえる", 20);
movelist[206] = new MoveData("ころがる", 20);
movelist[207] = new MoveData("みねうち", 40);
movelist[208] = new MoveData("いばる", 10);
movelist[209] = new MoveData("ミルクのみ", 10);
movelist[210] = new MoveData("スパーク", 20);
movelist[211] = new MoveData("れんぞくぎり", 20);
movelist[212] = new MoveData("はがねのつばさ", 25);
movelist[213] = new MoveData("くろいまなざし", 5);
movelist[214] = new MoveData("メロメロ", 15);
movelist[215] = new MoveData("ねごと", 10);
movelist[216] = new MoveData("いやしのすず", 5);
movelist[217] = new MoveData("おんがえし", 20);
movelist[218] = new MoveData("プレゼント", 15);
movelist[219] = new MoveData("やつあたり", 20);
movelist[220] = new MoveData("しんぴのまもり", 25);
movelist[221] = new MoveData("いたみわけ", 20);
movelist[222] = new MoveData("せいなるほのお", 5);
movelist[223] = new MoveData("マグニチュード", 30);
movelist[224] = new MoveData("ばくれつパンチ", 5);
movelist[225] = new MoveData("メガホーン", 10);
movelist[226] = new MoveData("りゅうのいぶき", 20);
movelist[227] = new MoveData("バトンタッチ", 40);
movelist[228] = new MoveData("アンコール", 5);
movelist[229] = new MoveData("おいうち", 20);
movelist[230] = new MoveData("こうそくスピン", 40);
movelist[231] = new MoveData("あまいかおり", 20);
movelist[232] = new MoveData("アイアンテール", 15);
movelist[233] = new MoveData("メタルクロー", 30);
movelist[234] = new MoveData("あてみなげ", 10);
movelist[235] = new MoveData("あさのひざし", 5);
movelist[236] = new MoveData("こうごうせい", 5);
movelist[237] = new MoveData("つきのひかり", 5);
movelist[238] = new MoveData("めざめるパワー", 15);
movelist[239] = new MoveData("クロスチョップ", 5);
movelist[240] = new MoveData("たつまき", 20);
movelist[241] = new MoveData("あまごい", 5);
movelist[242] = new MoveData("にほんばれ", 5);
movelist[243] = new MoveData("かみくだく", 15);
movelist[244] = new MoveData("ミラーコート", 20);
movelist[245] = new MoveData("じこあんじ", 10);
movelist[246] = new MoveData("しんそく", 5);
movelist[247] = new MoveData("げんしのちから", 5);
movelist[248] = new MoveData("シャドーボール", 15);
movelist[249] = new MoveData("みらいよち", 15);
movelist[250] = new MoveData("いわくだき", 15);
movelist[251] = new MoveData("うずしお", 15);
movelist[252] = new MoveData("ふくろだたき", 10);

class ItemData {
  constructor(name, effective) {
    this.name = name;
    this.effective = effective;
  }
}

const itemlist = new Array;
itemlist[0] = new ItemData("", false);
itemlist[2] = new ItemData("マスターボール", false);
itemlist[3] = new ItemData("ハイパーボール", false);
itemlist[4] = new ItemData("ひかりのこな", true);
itemlist[5] = new ItemData("スーパーボール", false);
itemlist[6] = new ItemData("モンスターボール", false);
itemlist[7] = new ItemData("カビチュウ", false);
itemlist[8] = new ItemData("じてんしゃ", false);
itemlist[9] = new ItemData("つきのいし", false);
itemlist[10] = new ItemData("どくけし", false);
itemlist[11] = new ItemData("やけどなおし", false);
itemlist[12] = new ItemData("こおりなおし", false);
itemlist[13] = new ItemData("ねむけざまし", false);
itemlist[14] = new ItemData("まひなおし", false);
itemlist[15] = new ItemData("かいふくのくすり", false);
itemlist[16] = new ItemData("まんたんのくすり", false);
itemlist[17] = new ItemData("すごいキズぐすり", false);
itemlist[18] = new ItemData("いいキズぐすり", false);
itemlist[19] = new ItemData("キズぐすり", false);
itemlist[20] = new ItemData("あなぬけのヒモ", false);
itemlist[21] = new ItemData("むしよけスプレー", false);
itemlist[22] = new ItemData("ピーピーマックス", false);
itemlist[23] = new ItemData("ほのおのいし", false);
itemlist[24] = new ItemData("かみなりのいし", false);
itemlist[25] = new ItemData("みずのいし", false);
itemlist[27] = new ItemData("マックスアップ", false);
itemlist[28] = new ItemData("タウリン", false);
itemlist[29] = new ItemData("ブロムヘキシン", false);
itemlist[30] = new ItemData("インドメタシン", false);
itemlist[31] = new ItemData("ラッキーパンチ", true);
itemlist[32] = new ItemData("リゾチウム", false);
itemlist[33] = new ItemData("ふしぎなアメ", false);
itemlist[34] = new ItemData("ヨクアタール", false);
itemlist[35] = new ItemData("リーフのいし", false);
itemlist[36] = new ItemData("メタルパウダー", true);
itemlist[37] = new ItemData("きんのたま", false);
itemlist[38] = new ItemData("ピッピにんぎょう", false);
itemlist[39] = new ItemData("なんでもなおし", false);
itemlist[40] = new ItemData("げんきのかけら", false);
itemlist[41] = new ItemData("げんきのかたまり", false);
itemlist[42] = new ItemData("エフェクトガード", false);
itemlist[43] = new ItemData("シルバースプレー", false);
itemlist[44] = new ItemData("ゴールドスプレー", false);
itemlist[45] = new ItemData("クリティカッター", false);
itemlist[47] = new ItemData("おいしいみず", false);
itemlist[48] = new ItemData("サイコソーダ", false);
itemlist[49] = new ItemData("ミックスオレ", false);
itemlist[50] = new ItemData("プラスパワー", false);
itemlist[52] = new ItemData("ディフェンダー", false);
itemlist[53] = new ItemData("スピーダー", false);
itemlist[54] = new ItemData("スペシャルアップ", false);
itemlist[55] = new ItemData("コインケース", false);
itemlist[56] = new ItemData("ダウジングマシン", false);
itemlist[58] = new ItemData("がくしゅうそうち", false);
itemlist[59] = new ItemData("ぼろのつりざお", false);
itemlist[60] = new ItemData("いいつりざお", false);
itemlist[61] = new ItemData("ぎんのはっぱ", false);
itemlist[62] = new ItemData("すごいつりざお", false);
itemlist[63] = new ItemData("ポイントアップ", false);
itemlist[64] = new ItemData("ピーピーエイド", false);
itemlist[65] = new ItemData("ピーピーリカバー", false);
itemlist[66] = new ItemData("ピーピーエイダー", false);
itemlist[67] = new ItemData("あかいウロコ", false);
itemlist[68] = new ItemData("ひでんのくすり", false);
itemlist[69] = new ItemData("ふねのチケット", false);
itemlist[70] = new ItemData("ふしぎなタマゴ", false);
itemlist[72] = new ItemData("ぎんいろのはね", false);
itemlist[73] = new ItemData("モーモーミルク", false);
itemlist[74] = new ItemData("せんせいのツメ", true);
itemlist[75] = new ItemData("どくけしのみ", true);
itemlist[76] = new ItemData("きんのはっぱ", false);
itemlist[77] = new ItemData("やわらかいすな", true);
itemlist[78] = new ItemData("するどいくちばし", true);
itemlist[79] = new ItemData("まひなおしのみ", true);
itemlist[80] = new ItemData("やけたきのみ", true);
itemlist[81] = new ItemData("こおったきのみ", true);
itemlist[82] = new ItemData("どくバリ", true);
itemlist[83] = new ItemData("おうじゃのしるし", true);
itemlist[84] = new ItemData("にがいきのみ", true);
itemlist[85] = new ItemData("はっかのみ", true);
itemlist[86] = new ItemData("あかぼんぐり", false);
itemlist[87] = new ItemData("ちいさなキノコ", false);
itemlist[88] = new ItemData("おおきなキノコ", false);
itemlist[89] = new ItemData("ぎんのこな", true);
itemlist[90] = new ItemData("あおぼんぐり", false);
itemlist[92] = new ItemData("おまもりこばん", false);
itemlist[93] = new ItemData("きぼんぐり", false);
itemlist[94] = new ItemData("みどぼんぐり", false);
itemlist[95] = new ItemData("きよめのおふだ", false);
itemlist[96] = new ItemData("しんぴのしずく", true);
itemlist[97] = new ItemData("まがったスプーン", true);
itemlist[98] = new ItemData("しろぼんぐり", false);
itemlist[99] = new ItemData("くろおび", true);
itemlist[100] = new ItemData("くろぼんぐり", false);
itemlist[102] = new ItemData("ももぼんぐり", false);
itemlist[103] = new ItemData("くろいめがね", true);
itemlist[104] = new ItemData("おいしいシッポ", false);
itemlist[105] = new ItemData("ピンクのリボン", true);
itemlist[106] = new ItemData("ながねぎ", true);
itemlist[107] = new ItemData("けむりだま", false);
itemlist[108] = new ItemData("とけないこおり", true);
itemlist[109] = new ItemData("じしゃく", true);
itemlist[110] = new ItemData("きせきのみ", true);
itemlist[111] = new ItemData("しんじゅ", false);
itemlist[112] = new ItemData("おおきなしんじゅ", false);
itemlist[113] = new ItemData("かわらずのいし", false);
itemlist[114] = new ItemData("のろいのおふだ", true);
itemlist[115] = new ItemData("いかりまんじゅう", false);
itemlist[118] = new ItemData("きせきのタネ", true);
itemlist[119] = new ItemData("ふといホネ", true);
itemlist[120] = new ItemData("きあいのハチマキ", true);
itemlist[122] = new ItemData("ちからのこな", false);
itemlist[123] = new ItemData("ちからねっこ", false);
itemlist[124] = new ItemData("ばんのうごな", false);
itemlist[125] = new ItemData("ふっかつそう", false);
itemlist[126] = new ItemData("かたいいし", true);
itemlist[127] = new ItemData("しあわせタマゴ", false);
itemlist[128] = new ItemData("カードキー", false);
itemlist[129] = new ItemData("きかいのぶひん", false);
itemlist[131] = new ItemData("おとしもの", false);
itemlist[132] = new ItemData("ほしのすな", false);
itemlist[133] = new ItemData("ほしのかけら", false);
itemlist[134] = new ItemData("ちかのカギ", false);
itemlist[135] = new ItemData("ていきけん", false);
itemlist[139] = new ItemData("もくたん", true);
itemlist[140] = new ItemData("きのみジュース", true);
itemlist[141] = new ItemData("ピントレンズ", true);
itemlist[144] = new ItemData("メタルコート", true);
itemlist[145] = new ItemData("りゅうのキバ", false);
itemlist[147] = new ItemData("たべのこし", true);
itemlist[151] = new ItemData("ふしぎなきのみ", true);
itemlist[152] = new ItemData("りゅうのウロコ", true);
itemlist[153] = new ItemData("はかいのいでんし", true);
itemlist[157] = new ItemData("せいなるはい", false);
itemlist[158] = new ItemData("ヘビーボール", false);
itemlist[159] = new ItemData("はながらメール", false);
itemlist[160] = new ItemData("レベルボール", false);
itemlist[161] = new ItemData("ルアーボール", false);
itemlist[162] = new ItemData("スピードボール", false);
itemlist[164] = new ItemData("でんきだま", true);
itemlist[165] = new ItemData("フレンドボール", false);
itemlist[166] = new ItemData("ムーンボール", false);
itemlist[167] = new ItemData("ラブラブボール", false);
itemlist[168] = new ItemData("きのはこ", false);
itemlist[169] = new ItemData("きりのはこ", false);
itemlist[170] = new ItemData("たいようのいし", false);
itemlist[171] = new ItemData("みずたまリボン", true);
itemlist[173] = new ItemData("アップグレード", false);
itemlist[174] = new ItemData("きのみ", true);
itemlist[175] = new ItemData("おうごんのみ", true);
itemlist[176] = new ItemData("ゼニガメじょうろ", false);
itemlist[178] = new ItemData("パークボール", false);
itemlist[179] = new ItemData("にじいろのはね", false);
itemlist[181] = new ItemData("かわらのかけら", false);
itemlist[182] = new ItemData("なみのりメール", false);
itemlist[183] = new ItemData("みずいろメール", false);
itemlist[184] = new ItemData("にがおえメール", false);
itemlist[185] = new ItemData("ラブリーメール", false);
itemlist[186] = new ItemData("ブイブイメール", false);
itemlist[187] = new ItemData("へんしんメール", false);
itemlist[188] = new ItemData("あおぞらメール", false);
itemlist[189] = new ItemData("おんぷメール", false);
itemlist[190] = new ItemData("まぼろしメール", false);
itemlist[192] = new ItemData("わざましん01", false);
itemlist[193] = new ItemData("わざましん02", false);
itemlist[194] = new ItemData("わざましん03", false);
itemlist[195] = new ItemData("わざましん04", false);
itemlist[197] = new ItemData("わざましん05", false);
itemlist[198] = new ItemData("わざましん06", false);
itemlist[199] = new ItemData("わざましん07", false);
itemlist[200] = new ItemData("わざましん08", false);
itemlist[201] = new ItemData("わざましん09", false);
itemlist[202] = new ItemData("わざましん10", false);
itemlist[203] = new ItemData("わざましん11", false);
itemlist[204] = new ItemData("わざましん12", false);
itemlist[205] = new ItemData("わざましん13", false);
itemlist[206] = new ItemData("わざましん14", false);
itemlist[207] = new ItemData("わざましん15", false);
itemlist[208] = new ItemData("わざましん16", false);
itemlist[209] = new ItemData("わざましん17", false);
itemlist[210] = new ItemData("わざましん18", false);
itemlist[211] = new ItemData("わざましん19", false);
itemlist[212] = new ItemData("わざましん20", false);
itemlist[213] = new ItemData("わざましん21", false);
itemlist[214] = new ItemData("わざましん22", false);
itemlist[215] = new ItemData("わざましん23", false);
itemlist[216] = new ItemData("わざましん24", false);
itemlist[217] = new ItemData("わざましん25", false);
itemlist[218] = new ItemData("わざましん26", false);
itemlist[219] = new ItemData("わざましん27", false);
itemlist[220] = new ItemData("わざましん28", false);
itemlist[222] = new ItemData("わざましん29", false);
itemlist[223] = new ItemData("わざましん30", false);
itemlist[224] = new ItemData("わざましん31", false);
itemlist[225] = new ItemData("わざましん48", false);
itemlist[226] = new ItemData("わざましん49", false);
itemlist[227] = new ItemData("わざましん50", false);
itemlist[228] = new ItemData("ひでんましん01", false);
itemlist[229] = new ItemData("ひでんましん02", false);
itemlist[230] = new ItemData("ひでんましん03", false);
itemlist[231] = new ItemData("ひでんましん04", false);
itemlist[232] = new ItemData("ひでんましん05", false);
itemlist[233] = new ItemData("ひでんましん06", false);
itemlist[234] = new ItemData("ひでんましん07", false);

const effectiveItems = [];
(function() {
  for (const i in itemlist) {
    const s = itemlist[i];
    s.effective && (effectiveItems[i] = s);
  }
})();

// --- Roma ---
function roma(str) {
  const re = /(([b-df-hj-mp-tv-z])\2*(?=\2))|((?:[b-df-hj-np-tv-z]|[cw]h|[b-df-hj-npr-tvxz]y|[bdgkmpstz][hw]|ts|)[aiueo]|[-0-9])|(xts?u)|(nn?)/gi;
  function f(sub, gs1, _, s, gs2, sn) {
    if (gs1) {
      if (gs1.length == 1) {
        return "[っッ]";
      }
      else {
        return "[っッ]{" + gs1.length + "}";
      }
    }
    else if (s) {
      return roma.table[s];
    }
    else if (gs2) {
      return "[っッ]";
    }
    else if (sn) {
      return "[んン]";
    }
    else {
      throw new Error("implementation error! " + sub);
    }
  }
  return str.replace(re, f);
}

roma.table = {
  a: "[あア]", i: "[いイ]", u: "[うウ]", e: "[えエ]", o: "[おオ]",
  ba: "[ばバ]", bi: "[びビ]", bu: "[ぶブ]", be: "[べベ]", bo: "[ぼボ]",
  bya: "[びビ][ゃャ]", byi: "[びビ][ぃィ]", byu: "[びビ][ゅュ]", bye: "[びビ][ぇェ]", byo: "[びビ][ょョ]",
  bha: "[ばバ][ぁァ]", bhi: "[ばバ][ぃィ]", bhu: "[ばバ][ぅゥ]", bhe: "[ばバ][ぃィ]", bho: "[ばバ][ぃィ]",
  bwa: "[びビ][ゎヮ]", bwi: "[びビ][ぃィ]", bwu: "[びビ][ぅゥ]", bwe: "[びビ][ぇェ]", bwo: "[びビ][ぉォ]",
  ca: "[かカ]", ci: "[しシ]", cu: "[くク]", ce: "[せセ]", co: "[こコ]",
  cya: "[ちチ][ゃャ]", cyi: "[ちチ][ぃィ]", cyu: "[ちチ][ゅュ]", cye: "[ちチ][ぇェ]", cyo: "[ちチ][ょョ]",
  cha: "[ちチ][ゃャ]", chi: "[ちチ]", chu: "[ちチ][ゅュ]", che: "[ちチ][ぇェ]", cho: "[ちチ][ょョ]",
  da: "[だダ]", di: "[ぢヂ]", du: "[づヅ]", de: "[でデ]", "do": "[どド]",
  dya: "[ぢヂ][ゃャ]", dyi: "[ぢヂ][ぃィ]", dyu: "[ぢヂ][ゅュ]", dye: "[ぢヂ][ぇェ]", dyo: "[ぢヂ][ょョ]",
  dha: "[でデ][ゃャ]", dhi: "[でデ][ぃィ]", dhu: "[でデ][ゅュ]", dhe: "[でデ][ぇェ]", dho: "[でデ][ょョ]",
  dwa: "[どド][ぁァ]", dwi: "[どド][ぃィ]", dwu: "[どド][ぅゥ]", dwe: "[どド][ぇェ]", dwo: "[どド][ぉォ]",
  fa: "[ふフ][ぁァ]", fi: "[ふフ][ぃィ]", fu: "[ふフ]", fe: "[ふフ][ぇェ]", fo: "[ふフ][ぉォ]",
  fya: "[ふフ][ゃャ]", fyi: "[ふフ][ぃィ]", fyu: "[ふフ][ゅュ]", fye: "[ふフ][ぇェ]", fyo: "[ふフ][ょョ]",
  ga: "[がガ]", gi: "[ぎギ]", gu: "[ぐグ]", ge: "[げゲ]", go: "[ごゴ]",
  gya: "[ぎギ][ゃャ]", gyi: "[ぎギ][ぃィ]", gyu: "[ぎギ][ゅュ]", gye: "[ぎギ][ぇェ]", gyo: "[ぎギ][ょョ]",
  gha: "[ぐグ][ぁァ]", ghi: "[ぐグ][ぃィ]", ghu: "[ぐグ][ぅゥ]", ghe: "[ぐグ][ぇェ]", gho: "[ぐグ][ぉォ]",
  gwa: "[ぐグ][ぁァ]", gwi: "[ぐグ][ぃィ]", gwu: "[ぐグ][ぅゥ]", gwe: "[ぐグ][ぇェ]", gwo: "[ぐグ][ぉォ]",
  ha: "[はハ]", hi: "[ひヒ]", hu: "[ふフ]", he: "[へヘ]", ho: "[ほホ]",
  hya: "[ひヒ][ゃャ]", hyi: "[ひヒ][ぃィ]", hyu: "[ひヒ][ゅュ]", hye: "[ひヒ][ぇェ]", hyo: "[ひヒ][ょョ]",
  ja: "[じジ][ゃャ]", ji: "[じジ]", ju: "[じジ][ゅュ]", je: "[じジ][ぇェ]", jo: "[じジ][ょョ]",
  jya: "[じジ][ゃャ]", jyi: "[じジ][ぃィ]", jyu: "[じジ][ゅュ]", jye: "[じジ][ぇェ]", jyo: "[じジ][ょョ]",
  ka: "[かカ]", ki: "[きキ]", ku: "[くク]", ke: "[けケ]", ko: "[こコ]",
  kya: "[きキ][ゃャ]", kyi: "[きキ][ぃィ]", kyu: "[きキ][ゅュ]", kye: "[きキ][ぇェ]", kyo: "[きキ][ょョ]",
  kha: "[くク][ぁァ]", khi: "[くク][ぃィ]", khu: "[くク][ぅゥ]", khe: "[くク][ぇェ]", kho: "[くク][ぉォ]",
  kwa: "[くク][ぁァ]", kwi: "[くク][ぃィ]", kwu: "[くク][ぅゥ]", kwe: "[くク][ぇェ]", kwo: "[くク][ぉォ]",
  la: "[らラ]", li: "[りリ]", lu: "[るル]", le: "[れレ]", lo: "[ろロ]",
  lya: "[りリ][ゃャ]", lyi: "[りリ][ぃィ]", lyu: "[りリ][ゅュ]", lye: "[りリ][ぇェ]", lyo: "[りリ][ょョ]",
  ma: "[まマ]", mi: "[みミ]", mu: "[むム]", me: "[めメ]", mo: "[もモ]",
  mya: "[みミ][ゃャ]", myi: "[みミ][ぃィ]", myu: "[みミ][ゅュ]", mye: "[みミ][ぇェ]", myo: "[みミ][ょョ]",
  mha: "[むム][ぁァ]", mhi: "[むム][ぃィ]", mhu: "[むム][ぅゥ]", mhe: "[むム][ぇェ]", mho: "[むム][ぉォ]",
  mwa: "[むム][ゎヮ]", mwi: "[むム][ぃィ]", mwu: "[むム][ぅゥ]", mwe: "[むム][ぇェ]", mwo: "[むム][ぉォ]",
  na: "[なナ]", ni: "[にニ]", nu: "[ぬヌ]", ne: "[ねネ]", no: "[のノ]",
  nya: "[にニ][ゃャ]", nyi: "[にニ][ぃィ]", nyu: "[にニ][ゅュ]", nye: "[にニ][ぇェ]", nyo: "[にニ][ょョ]",
  pa: "[ぱパ]", pi: "[ぴピ]", pu: "[ぷプ]", pe: "[ぺペ]", po: "[ぽポ]",
  pya: "[ぴピ][ゃャ]", pyi: "[ぴピ][ぃィ]", pyu: "[ぴピ][ゅュ]", pye: "[ぴピ][ぇェ]", pyo: "[ぴピ][ょョ]",
  pha: "[ぷプ][ぁァ]", phi: "[ぷプ][ぃィ]", phu: "[ぷプ][ぅゥ]", phe: "[ぷプ][ぇェ]", pho: "[ぷプ][ぉォ]",
  pwa: "[ぷプ][ゎヮ]", pwi: "[ぷプ][ぃィ]", pwu: "[ぷプ][ぅゥ]", pwe: "[ぷプ][ぇェ]", pwo: "[ぷプ][ぉォ]",
  qa: "[くク][ぁァ]", qi: "[くク][ぃィ]", qu: "[くク][ぅゥ]", qe: "[くク][ぇェ]", qo: "[くク][ぉォ]",
  ra: "[らラ]", ri: "[りリ]", ru: "[るル]", re: "[れレ]", ro: "[ろロ]",
  rya: "[りリ][ゃャ]", ryi: "[りリ][ぃィ]", ryu: "[りリ][ゅュ]", rye: "[りリ][ぇェ]", ryo: "[りリ][ょョ]",
  sa: "[さサ]", si: "[しシ]", su: "[すス]", se: "[せセ]", so: "[そソ]",
  sya: "[しシ][ゃャ]", syi: "[しシ][ぃィ]", syu: "[しシ][ゅュ]", sye: "[しシ][ぇェ]", syo: "[しシ][ょョ]",
  sha: "[しシ][ゃャ]", shi: "[しシ]", shu: "[しシ][ゅュ]", she: "[しシ][ぇェ]", sho: "[しシ][ょョ]",
  swa: "[すス][ぁァ]", swi: "[すス][ぃィ]", swu: "[すス][ぅゥ]", swe: "[すス][ぇェ]", swo: "[すス][ぉォ]",
  ta: "[たタ]", ti: "[ちチ]", tu: "[つツ]", te: "[てテ]", to: "[とト]",
  tya: "[ちチ][ゃャ]", tyi: "[ちチ][ぃィ]", tyu: "[ちチ][ゅュ]", tye: "[ちチ][ぇェ]", tyo: "[ちチ][ょョ]",
  tha: "[てテ][ゃャ]", thi: "[てテ][ぃィ]", thu: "[てテ][ゅュ]", the: "[てテ][ぇェ]", tho: "[てテ][ょョ]",
  twa: "[とト][ぁァ]", twi: "[とト][ぃィ]", twu: "[とト][ぅゥ]", twe: "[とト][ぇェ]", two: "[とト][ぉォ]",
  va: "[ゔヴ][ぁァ]", vi: "[ゔヴ][ぃィ]", vu: "[ゔヴ]", ve: "[ゔヴ][ぇェ]", vo: "[ゔヴ][ぉォ]",
  vya: "[ゔヴ][ゃャ]", vyi: "[ゔヴ][ぃィ]", vyu: "[ゔヴ][ゅュ]", vye: "[ゔヴ][ぇェ]", vyo: "[ゔヴ][ょョ]",
  wa: "[わワ]", wi: "[うウ][ぃィ]", wu: "[うウ]", we: "[うウ][ぇェ]", wo: "[をヲ]", wyi: "[ゐヰ]", wye: "[ゑヱ]",
  wha: "[うウ][ぁァ]", whi: "[うウ][ぃィ]", whu: "[うウ]", whe: "[うウ][ぇェ]", who: "[うウ][ぉォ]",
  xa: "[ぁァ]", xi: "[ぃィ]", xu: "[ぅゥ]", xe: "[ぇェ]", xo: "[ぉォ]",
  xya: "[ゃャ]", xyi: "[ぃィ]", xyu: "[ゅュ]", xye: "[ぇェ]", xyo: "[ょョ]",
  ya: "[やヤ]", yi: "[いイ]", yu: "[ゆユ]", ye: "[いイ][ぇェ]", yo: "[よヨ]",
  za: "[ざザ]", zi: "[じジ]", zu: "[ずズ]", ze: "[ぜゼ]", zo: "[ぞゾ]",
  zya: "[じジ][ゃャ]", zyi: "[じジ][ぃィ]", zyu: "[じジ][ゅュ]", zye: "[じジ][ぇェ]", zyo: "[じジ][ょョ]",
  zha: "[ずズ][ぁァ]", zhi: "[ずズ][ぃィ]", zhu: "[ずズ][ぅゥ]", zhe: "[ずズ][ぇェ]", zho: "[ずズ][ぉォ]",
  zwa: "[ずズ][ゎヮ]", zwi: "[ずズ][ぃィ]", zwu: "[ずズ][ぅゥ]", zwe: "[ずズ][ぇェ]", zwo: "[ずズ][ぉォ]",
  tsa: "[つツ][ぁァ]", tsi: "[つツ][ぃィ]", tsu: "[つツ]", tse: "[つツ][ぇェ]", tso: "[つツ][ぉォ]",
  0: "０", 1: "１", 2: "２", 3: "３", 4: "４", 5: "５", 6: "６", 7: "７", 8: "８", 9: "９", "-": "ー"
};

// --- DoubleLinkedHashMap ---
class DoubleLinkedHashMapEntry {
  constructor(value, key, next, prev) {
    this.value = value;
    this.key = key;
    this.next = next || this;
    this.prev = prev || this;
    }
}

class DoubleLinkedHashMap {
  constructor() {
    this.table = Object.create(null);
    this.pos = null;
  }
  noEmpty() {
    if (!this.pos) {
      throw new Error("No empty HashMap");
    }
  }
  next() {
    this.noEmpty();
    return this.pos.next.value;
  }
  previous() {
    this.noEmpty();
    return this.pos.prev.value;
  }
  get(k) {
    const entry = this.table[k];
    return entry && entry.value;
  }
  getHead() {
    this.noEmpty();
    return this.pos.value;
  }
  setHead(k) {
    const entry = this.table[k];
    if (entry) {
      this.pos = entry;
    }
    else {
      throw new Error("Key not found: " + k);
    }
  }
  push(k, v) {
    let entry;
    if (this.table[k]) {
      throw new Error("Already exist key: " + k);
    }
    if (this.pos) {
      entry = new DoubleLinkedHashMapEntry(v, k, this.pos, this.pos.prev);
      entry.next.prev = entry;
      entry.prev.next = entry;
    }
    else {
      entry = new DoubleLinkedHashMapEntry(v, k);
    }
    this.pos = this.table[k] = entry;
  }
  pushBack(k, v) {
    this.push(k, v);
    this.pos = this.pos.next;
  }
  remove(k) {
    const entry = this.table[k];
    if (entry) {
      if (entry.next == entry) {
        this.pos = null;
      }
      else {
        if (this.pos == entry) {
          this.pos = entry.next;
        }
        entry.next.prev = entry.prev;
        entry.prev.next = entry.next;
      }
      delete this.table[k];
    }
    else {
      throw new Error("Key not found: " + k);
    }
  }
  forEach(f) {
    const start = this.pos;
    if (start) {
      let entry = start;
      do {
        f(entry.value, entry.key);
        entry = entry.next;
      } while (!(entry == start));
    }
  }
  some(f) {
    const start = this.pos;
    if (start) {
      let entry = start;
      do {
        if (f(entry.value, entry.key)) {
          return true;
        };
        entry = entry.next;
      } while (!(entry == start));
      return false;
    }
    else {
      return true;
    }
  }
  map(f) {
    const res = [];
    this.forEach(function (v, k) { res.push(f(v, k)); });
    return res;
  }
  toString() {
    return "DoubleLinkedHashMap(" + this.map(function (v, k) { return k + ": " + v; }).join(", ") + ")";
  }
}

// --- Error ---

class XPDError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ImplementationError extends XPDError {
  constructor(message) {
    super(message);
  }
}

class NoPartyError extends ImplementationError {
  constructor(no) {
    super("party " + no + " doesn't exist");
    this.no = no;
  }
}
/*
function NoBufferError(name) {
    this.name = name;
    ImplementationError.call(this, "buffer " + name + " doesn't exist");
}
NoBufferError.prototype.__proto__ = ImplementationError.prototype;
*/
class UserError extends XPDError {
  constructor(message) {
    super(message);
  }
}

class PartyNotFound extends UserError {
  constructor(no) {
    super( "パーティ " + no + " はありません。");
    this.no = no;
  }
}

class BufferNotFound extends UserError {
  constructor(name) {
    super("バッファ " + name + " はありません。");
    this.name = name;
  }
}

class WrongNumberOfPoke extends UserError {
  constructor() {
    super("ポケモンの数が6匹ではありません");
  }
}

class InvalidInput extends UserError {
  constructor(message) {
    super(message);
  }
}

class InvalidValueOfTextbox extends InvalidInput {
  constructor(message, textbox) {
    super(message);
    this.textbox = textbox;
  }
}

class HTTPError extends XPDError {
  constructor(message) {
    super(message);
  }
}

class BadHTTPResponse extends HTTPError {
  constructor(message, response) {
    super(message + "\nstatus: " + response.status);
    this.response = response;
  }
}

// --- System ---
const initializeHooks = [];

function getNumber() {
  return $f.CBAN.value-0;
}

function setNumber(n) {
  return $f.CBAN.value = n;
}

function getCookie(n) {
  const a = $d.cookie.split(";");
  for (let i = 0; i < a.length; i++) {
    if (new RegExp("PD" + (n - 1) + "=(.+)").exec(a[i])) {
      if (RegExp.$1 == "2") {
        return null;
      }
      return RegExp.$1.slice(4).split("_x_");
    }
  }
  return null;
}

function getCookies() {
  const a = $d.cookie.split(";");
  const ary = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    if (new RegExp("PD(\\d+)" + "=(.+)").exec(a[i])) {
      if (RegExp.$2 != "2") {
        ary[RegExp.$1] = RegExp.$2.slice(4).split("_x_");
      }
    }
  }
  return ary;
}

function setCookie(name, value) {
  const expires = (new Date).toGMTString().replace(/\d\d\d\d/, function (s) { return parseInt(s) + 5; });
  const val = name + "=" + value + "; expires=" + expires + "; path=/_/; sameSite=lax";
  $d.cookie = val;
}

function deleteCookie(name) {
  $d.cookie = name + "=; expires=" + (new Date((new Date()) - 3600)).toGMTString() + "; path=/_/; sameSite=lax";
}

function extendCookiesDeadline(cookie) {
  const a = (cookie ?? $d.cookie).split(";");
  a.forEach(function (s) {
    const ma = /(.+?)=(.+)/.exec(s);
    setCookie(ma[1], ma[2]);
  });
}

function Poke() {}
/*PDの形式からポケモンオブジェクトを生成する*/
Poke.fromPD = function(pd_str, force) {
  /* format check */
  if(!force && !/^(?:\d{1,3}_){2}(?:[0-9a-f]_){4}(?:\d{1,2}_){5}(?:\d{1,3}_){4}(?:\d{1,2}_){4}(?:[0-3]_){4}\d{1,3}_0?_\d{1,3}$/i.test(pd_str)) {
    throw new ImplementationError("wrong pd format: " + pd_str);
  }
  const a = pd_str.split("_");
  const poke = new Poke();
  poke.no = a[0];
  poke.lv = a[1];
  poke.id = [a[2], a[3], a[4], a[5]];
  poke.ef = [a[6], a[7], a[8], a[9], a[10]];
  poke.mv = [a[11], a[12], a[13], a[14]];
  poke.pp = [a[15], a[16], a[17], a[18]];
  poke.p_up = [a[19], a[20], a[21], a[22]];
  poke.hp = a[23];
  poke.item = a[25];
  /* validation check */
  if (!(pokelist[poke.no] && poke.lv >= 1 && poke.lv <= 100 &&
        poke.ef.every(function (i) { return i >= 0 && i <= 63; }) &&
        poke.mv.every(function (i) { return movelist[i]; }) &&
        poke.p_up.every(function (i) { return i >= 0 && i <= 3; }) &&
        itemlist[poke.item])) {
    throw new ImplementationError("wrong pd value: " + pd_str);
  }
  return poke;
};

const consPoke = function (i) { return Poke.fromPD(i); };

function initLoadParty() {
  const pd = $f.PD.value;
  const pd_ary = pd ? pd.split("_x_") : getCookie(getNumber());
  if (pd_ary.length != 6) {
    throw new WrongNumberOfPoke;
  }
  return pd_ary.map(function (pd_str) { return Poke.fromPD(pd_str, true); });
}

function loadParty(i) {
  const pd = $f.PD.value;
  const a = i == null ? (pd ? pd.split("_x_") : getCookie(getNumber())) : getCookie(i);
  if (a == null) {
    throw new NoPartyError(i);
  }
  if (a.length != 6) {
    throw new WrongNumberOfPoke;
  }
  return a.map(consPoke);
}

function loadParties() {
  return getCookies().map(function (i) { return i.map(consPoke); });
}

function partyReflectForm(poke) {
  const len = getPokeNum();
  const form = $f;
  for (let i = 0; i < len; i++) {
    form["POKE" + i].value = pokelist[poke[i].no].name;
    form["LV" + i].value = poke[i].lv;
    form["KO" + i].value = poke[i].id.join("");
    for (let j = 0; j < 5; j++) {
      form["EF" + i + "_" + j].value = poke[i].ef[j];
    }
    for (let j = 0; j < 4; j++) {
      form["WAZA" + i + "_" + j].value = movelist[poke[i].mv[j]].name;
    }
    form["ITEM" + i].value = itemlist[poke[i].item].name;
  }
  formRefresh();
}

var bufferMap = new DoubleLinkedHashMap;
function Buffer(name, party) {
  this.name = name;     /* 特殊 */

  this.party = party;                  /* バッファローカル */
  this.pref = Object.create(xpd.pref); /* バッファローカル */

  this.pd = "";       /* 退避 */
  this.form = null;   /* 退避 */
}
Buffer.getTexts = function () {
  return Array.prototype.filter.call($d.getElementsByTagName("input"),
                                     function (t) { return t.type == "text"; });
};
Buffer.prototype.saveForm = function () {
  const texts = Buffer.getTexts();
  this.form = texts.map(function (t) { return t.value; });
  this.pd = $f.PD.value;
};
Buffer.prototype.restoreForm = function () {
  setNumber(this.name);
  $f.PD.value = this.pd;

  const form = this.form;
  if (form) {
    const texts = Buffer.getTexts();
    texts.forEach(function (t, i) { t.value = form[i]; });
  }
  else {
    partyReflectForm(this.party);
  }
  drawModeLine();
  formRefresh();
};
Buffer.prototype.changes = function() {
  if (this == currentBuffer()) {
    this.saveForm();
  }
  const n = Number(this.name);

  const texts = Buffer.getTexts();
  const form = {};
  const thisform = this.form;
  texts.forEach(function (t, i) {
    form[t.name] = { value: thisform[i] };
  });
  try {
    setPoke(form, this);
    const pd = getPD(this.party);
    return getCookie(n).join("_x_") != pd;
  }
  catch (e) {
    if (e instanceof InvalidValueOfTextbox) {
      return true;
    }
    else {
      throw e;
    }
  }
};

function currentBuffer() {
  return bufferMap.getHead();
}

function getBuffer(name) {
  return bufferMap.get(name);
}

function initialBuffer(name, party) {
  bufferMap.push(name, new Buffer(name, party));
}

function makeBuffer(name, party) {
  let buf = getBuffer(name);
  if (!buf) {
    bufferMap.pushBack(name, buf = new Buffer(name, party));
  }
  return buf;
}

function selectBuffer(buf) {
  const name = buf.name;
  if (getBuffer(name)) {
    currentBuffer().saveForm();
    bufferMap.setHead(name);
    currentBuffer().restoreForm();
  }
  else {
    throw new ImplementationError("Buffer `" + buf.toSource() + "' is not in bufferMap");
  }
}

function killBuffer0(buf) {
  const pos = bufferMap.pos;
  if (pos && pos != pos.next) {
    if (buf == currentBuffer()) {
      selectBuffer(pos.next.value);
    }
    bufferMap.remove(buf.name);
  }
  else {
    throw new UserError("バッファが少なすぎます。");
  }
}

/* "−" -> "ー" */
function normalizeNobashi(str) {
  return str.replace(/−|－/g, "ー").replace(/10/g, "１０");
}

function nameToIndex(name) {
  name = normalizeNobashi(name);
  for (let i = 0; i < pokelist.length; i++) {
    if (pokelist[i] && name == pokelist[i].name) {
      return i;
    }
  }
  return -1;
}

function moveToIndex(move) {
  move = normalizeNobashi(move);
  for (let i = 0; i < movelist.length; i++) {
    if (movelist[i] && move == movelist[i].name) {
      return i;
    }
  }
  return -1;
}

function itemToIndex(item) {
  item = normalizeNobashi(item);
  for (let i = 0; i < itemlist.length; i++) {
    if (itemlist[i] && item == itemlist[i].name) {
      return i;
    }
  }
  return -1;
}

function getPokeNum() {
  return $d.getElementsByTagName('table')[0].rows.length - 1;
}

function calcHP(no, lv, hp_id, hp_ef) {
  return Math.floor(((pokelist[no].hp + hp_id) * 2 + hp_ef) * lv / 100) + lv + 10;
}

function calcHPId(id) {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    result += (parseInt("0x" + id[i]) % 2) * Math.pow(2, 3 - i);
  }
  return result;
}
function getId(n, form) {
  form = form ?? $f;
  const box = form["KO" + n];
  const ko = box.value;
  if (ko.length != 4 || isNaN(parseInt("0x" + ko))) {
    throw new InvalidValueOfTextbox((parseInt(n) + 1) + "匹目の個体値が不正です。", box);
  }
  return ko.split("");
}

function setPoke(form, buffer) {
  const poke_num = getPokeNum();
  form = form ?? $f;
  const poke = (buffer ?? currentBuffer()).party;
  for (let i = 0; i < poke_num; i++) {
    const lv_box = form["LV" + i];
    const lv = parseInt(lv_box.value);
    if (isNaN(lv) || lv < 1 || lv > 100) {
      throw new InvalidValueOfTextbox((i + 1) + "匹目のレベルが不正です。", lv_box);
    }
    poke[i].lv = lv;
    const no_box = form["POKE" + i];
    const no = nameToIndex(no_box.value);
    if (!pokelist[no]) {
      throw new InvalidValueOfTextbox((i + 1) + "匹目の種族名が不正です。", no_box);
    }
    poke[i].no = no;
    for (let j = 0; j < 4; j++) {
      const mv_box = form["WAZA" + i + "_" + j];
      const mv = moveToIndex(mv_box.value);
      if (!movelist[mv]) {
        throw new InvalidValueOfTextbox((i + 1) + "匹目の技" + (j + 1) + "が不正です。", mv_box);
      }
      poke[i].mv[j] = mv;
      const base_pp = movelist[mv].pp;
      poke[i].pp[j] = base_pp === 1 ? 1 : base_pp * (5 + Number(poke[i].p_up[j])) / 5;
    }
    poke[i].id = getId(i, form);
    for (let j = 0; j < 5; j++) {
      const ef_box = form["EF" + i + "_" + j];
      const ef = Number(ef_box.value);
      if (isNaN(ef) || ef < 0 || ef > 63) {
        throw new InvalidValueOfTextbox((i + 1) + "匹目の努力値が不正です。", ef_box);
      }
      poke[i].ef[j] = ef;
    }
    const item_box = form["ITEM" + i];
    const item = itemToIndex(item_box.value);
    if (itemlist[item] == undefined) {
      throw new InvalidValueOfTextbox((i + 1) + "匹目のアイテム名が不正です。", item_box);
    }
    poke[i].item = item;
    poke[i].hp = calcHP(no, lv, calcHPId(poke[i].id), parseInt(poke[i].ef[0]));
  }
}

/*pokeの状態からPDに値をget*/
function getPD(party) {
  party = party ?? currentBuffer().party;
  function join(ary) {
    return ary.join("_");
  }
  const poke_num = getPokeNum();
  const ary = new Array(poke_num);
  for (let i = 0; i < poke_num; i++) {
    ary[i] = join([party[i].no,
                   party[i].lv,
                   join(party[i].id),
                   join(party[i].ef),
                   join(party[i].mv),
                   join(party[i].pp),
                   join(party[i].p_up),
                   party[i].hp,
                   0,
                   party[i].item]);
  }
  return ary.join("_x_");
}

/*pokeの状態からPDに値をset*/
function setPD() {
  $f.PD.value = getPD();
}

// --- DOM ---
function createInput(attr, style) {
  const input = getWrappedJSObject($d.createElement("input"));
  for (const i in attr) {
    if (/^on/.test(i)) {
      input[i] = attr[i];
    }
    else {
      input.setAttribute(i, attr[i]);
    }
  }
  if (style) {
    for (const i in style) {
      input.style[i] = style[i];
    }
  }
  return input;
}

// --- Echo Area ---
function createEchoArea() {
  const buf = $d.createElement("div");
  buf.id = "echo-area";
  buf.setAttribute("style", "margin-left: 2em; background-color: inherit");
  $d.body.appendChild(buf);
  return true;
}

function message(obj) {
  const echoArea = $d.getElementById("echo-area");
  if (obj.appendChild) {
    echoArea.innerHTML = "";
    echoArea.appendChild(obj);
  }
  else {
    echoArea.innerHTML = obj;
  }
}

function messageText(str) {
  $d.getElementById("echo-area").innerHTML = str.replace("\n", "<br />");
}

function messageRawText(str) {
  const pre = $d.createElement("pre");
  pre.textContent = str;
  message(pre);
}

function getMessage() {
  return $d.getElementById("echo-area").innerHTML;
}

function messageWithTextbox(str) {
  message('<input id="message-textbox" type="text" size="64"/>');
  const box = $d.getElementById("message-textbox");
  box.value = str;
  box.select();
}

// --- Error Handler ---
function maybeBug(mes, stack) {
  messageRawText([mes,
                  "これはxpdのバグかもしれません。",
                  ,
                  "version: " + xpd.version,
                  "platform: " + xpd.platform,
                  "browser: " + xpd.browser,
                  "stack trace:"].concat(stack).join("\n"));
}

function handleInteractiveError(er) {
  if (er instanceof Error) {
    if (er instanceof XPDError && !(er instanceof ImplementationError)) {
      messageText(er.message);
    }
    else {
      maybeBug(er, er.stack);
    }
  }
  else {
    maybeBug(er);
  }
}

// --- Keymap.js ---
const AsyncFunction = (async () => {}).constructor;

const Key = {
  translationKeytable: {
    "¥": "\\"
  },
  isModifierKey(ev) {
    return /^(?:Alt|Control|Meta|Shift)$/.test(ev.key);
  },
  isToggleKey(ev) {
    return /Lock$/.test(ev.key);
  },
  isArrowKey(ev) {
    return /^Arrow/.test(ev.key);
  },
  isFunctionKey(ev) {
    return /^F[0-9]+$/.test(ev.key);
  },
  isSpecialKey(ev) {
    return Key.isArrowKey(ev) ||
      Key.isFunctionKey(ev) ||
      /^(?: | |Escape|Tab|Backspace|Delete|Enter|Lang[12]|Home|End|Page(?:Up|Down)|Insert|Pause)$/.test(ev.key);
  },
  isProcessKey(ev) {
    return ev.key === "Process";
  },
  guessAlnum(ev) {
    const code = ev.code;
    let ma;
    if ((ma = /^Key(.)$/.exec(code))) {
      return ev.shiftKey ? ma[1] : ma[1].toLowerCase();
    }
    else if ((ma = /^(?:Digit|Numpad)([0-9])$/.exec(code))) {
      return ma[1];
    }
    else {
      return null;
    }
  },
  guess(ev) {
    const code = ev.code;

    const key = Key.guessAlnum(ev);
    if (key != null) {
      return key;
    }
    else if (/^(?:LEFT|RIGHT)$/.test(ev.location)) {
      return ev.key;
    }
    else if (Key.isSpecialKey(ev)) {
      return code;
    }
    else {
      console.log("can't guess key:", ev);
      return "Unknown";
    }
  },
  needsToGuessForStringify(ev) {
    return false;
  },
  stringifyEvent(ev) {
    const key = Key.needsToGuessForStringify(ev) ?
          Key.guess(ev) :
          ev.key;
    return (ev.ctrlKey ? "C-" : "") +
      (ev.metaKey ? "M-" : "") +
      (ev.altKey ? "A-" : "") +
      ((ev.shiftKey && Key.isSpecialKey(ev)) ? "S-" : "") +
      (Key.translationKeytable[key] ??
       ((key === " " || key === "Enter") ? ev.code : key));
  },
  stringifyEventSequence(seq) {
    return seq.map(pair => Key.stringify(pair[0])).join(" ");
  },
  stringify(obj) {
    return obj instanceof EventSequence ?
      Key.stringifyEventSequence(obj) :
      obj instanceof Event ?
      Key.stringifyEvent(obj) :
      (() => {
        throw TypeError(`Event or EventSequence required, but got ${obj}`);
      })();
  },
  symbol: Object.create(null),
  defineSymbol(name) {
    Key.symbol[name] = Symbol("Key.symbol." + name);
  },
  parse(str) {
    const re = /((?:C-)?(?:M-)?(?:A-)?(?:S-)?(?:[A-Z][a-z]+|[^ ]))(?: |($))/gy;
    const result = [];
    let last;
    for (let ma; ma = re.exec(str);) {
      result.push(ma[1]);
      last = ma[2];
    }
    if (last !== "") {
      throw Error(`bad key string: "${str}"`);
    }
    return result;
  }
};

Key.defineSymbol("commandMissing");
Key.defineSymbol("prefixKeyHandled");

Object.seal(Key);

if (xpd.platform === "Mac OS X") {
  Key.needsToGuessForStringify = function (ev) {
    return ev.altKey;
  };
}

class EventSequence extends Array {
  constructor(...args) {
    super(...args);
  }
  add(ev, keymap) {
    this.push([ev, keymap]);
  }
  get last() {
    if (this.length === 0) {
      throw Error("empty EventSequence");
    }
    else {
      return this[this.length - 1];
    }
  }
  get lastEvent() {
    return this.last[0];
  }
  get lastKeymap() {
    return this.last[1];
  }
}

function stopEvent(ev) {
  ev.stopImmediatePropagation();
  ev.preventDefault();
}

class KeymapObserver {
  constructor(keymap, type, target) {
    this.type = type;
    this.target = target;
    this.active = false;
    this.listener = exportUnsafe(this.dispatch.bind(this));
    this.rootMap = keymap;
    this.resetEventSequence();
  }
  resetEventSequence() {
    this.currentMap = this.rootMap;
    this.eventSequence = new EventSequence;
  }
  isActive() {
    return this.active;
  }
  activate() {
    if (this.active) {
      throw Error("already activated");
    }
    this.target.addEventListener(this.type, this.listener, false);
    this.active = true;
  }
  deactivate() {
    if (!this.active) {
      throw Error("does not activated");
    }
    this.target.removeEventListener(this.type, this.listener, false);
    this.active = false;
  }
  runKeymapHooks(type) {
    const seq = this.eventSequence;
    for (let i = seq.length; i--;) {
      let [_, keymap] = seq[i];
      let hook = keymap[type];
      if (hook && !hook(seq)) {
        // 偽値なら終了、真値なら伝播
        break;
      }
    }
  }
  dispatch(ev) {
    const keymap = this.currentMap;

    if (keymap.ignoresKey(ev)) {
      // console.log("ignore:", ev);
      return;
    }

    const key = Key.stringify(ev);
    const value = keymap.get(key);

    this.eventSequence.add(ev, keymap);
    // console.log("dispatch event:", ev, "as key:", key, "to:", value);
    if (!value) {
      try {
        if (keymap !== this.rootMap) {
          stopEvent(ev);
        }
        this.runKeymapHooks(Key.symbol.commandMissing);
      }
      finally {
        this.resetEventSequence();
      }
    }
    else if (value instanceof KeymapEventListener) {
      try {
        value.run(this.eventSequence);
      }
      finally {
        this.resetEventSequence();
      }
    }
    else if (value instanceof Keymap) {
      this.currentMap = value;
      stopEvent(ev);
      this.runKeymapHooks(Key.symbol.prefixKeyHandled);
    }
    else {
      throw TypeError(`wrong value in keymap: ${value}`);
    }
  }
}

class KeymapValue {}

class Keymap extends KeymapValue {
  constructor(name, parent) {
    super();
    this.name = name;
    this.parent = parent;
    this.table = new Map();
  }
  [Symbol.iterator]() {
    return this.table[Symbol.iterator]();
  }
  get(key) {
    return this.table.get(key) ?? (this.parent ? this.parent.get(key) : undefined);
  }
  add(key, value) {
    this.table.set(key, value);
  }
  define_keyseq(keyseq, value) {
    const [key, ...rest] = keyseq;
    if (rest.length === 0) {
      this.add(key, value);
    }
    else {
      let keymap = this.get(key);
      if (!(keymap instanceof Keymap)) {
        this.add(key, keymap = new this.constructor(key));
      }
      keymap.define_keyseq(rest, value);
    }
  }
  define(str, value) {
    if (value instanceof KeymapValue) {
      this.define_keyseq(Key.parse(str), value);
    }
    else if (typeof(value) === "function") {
      this.define(str, xpd.commandFromFunction.get(value) ?? new Command(value));
    }
    else {
      throw TypeError(`wrong argument: ${value}`);
    }
  }
  undef(key) {
    this.table.delete(key);
  }
  defineKeys(obj) {
    for (const key in obj) {
      this.define(key, obj[key]);
    }
  }
  makeSubKeymap(key, name, parent) {
    const sub = new Keymap(name ?? key, parent);
    this.table.set(key, sub);
    return sub;
  }
  observe(type, target) {
    const observer = new KeymapObserver(this, type, target);
    observer.activate();
    return observer;
  }
  ignoresKey(ev) {
    return Key.isModifierKey(ev) || Key.isToggleKey(ev) || Key.isProcessKey(ev);
  }
  toString() {
    return `[Keymap ${this.name}]`;
  }
}

class KeymapEventListener extends KeymapValue {
  static camelCaseToKebabCase(name) {
    const re_str = "([A-Z]+(?:(?=[A-Z][a-z])|$)|[A-Z][a-z]*)";
    const re0 = RegExp("^" + re_str, "y");
    const re1 = RegExp(re_str, "g");
    const ma = re0.exec(name);
    const sub = s => s.replace(re1, "-$1");
    return (ma ?
            ma[1] + sub(name.substring(re0.lastIndex)) :
            sub(name)
           ).toLowerCase();
  }
  // option
  //   document: String
  //   argument: 'event-sequence' |'last-event'
  //   name: String
  constructor(origFunc, options = {}) {
    super();
    // const acceptOptions = ["document", "argument", "name"];
    // for (const opt in options) {
    //   if (!acceptOptions.includes(opt)) {
    //     throw Error(`unknown option: ${opt}`);
    //   }
    // }

    this.options = Object.freeze(options);
    this.name = (options.name != null) ? options.name :
      origFunc.name ? KeymapEventListener.camelCaseToKebabCase(origFunc.name) :
      (() => { throw new Error("anonymous function is invalid"); })();
    this.origFunc = origFunc;

    let func;

    switch (options.argument) {
    case "last-event":
    case undefined:
    case null:
      func = seq => origFunc(seq.lastEvent);
      break;
    case "event-sequence":
      func = origFunc;
      break;
    default:
      throw Error(`unknown value for option.argument: ${options.argument}`);
    }
    this.body = func;

    if (options.document != null) {
      this.document = options.document;
    }
  }
  run(evs) {
    const body = this.body;
    return body(evs);
  }
  isAsync() {
    return this.origFunc instanceof AsyncFunction;
  }
}

// --- Command System ---
var previousCommand;

class Command extends KeymapEventListener {
  constructor(origFunc, options = {}) {
    super(origFunc, options);
    this.scope = options.scope ?? "document";
    if (!["document", "form"/*, "line"*/].includes(this.scope)) {
      throw new ImplementationError(`bad value for Command options.scope: ${this.scope}`);
    }
  }
  run(evs) {
    const ev = evs.lastEvent;
    if (ev instanceof Event) {
      stopEvent(ev);
    }
    try {
      message("");
      return super.run(evs);
    }
    catch (er) {
      handleInteractiveError(er);
      return false;
    }
    finally {
      previousCommand = this;
    }
  }
  exec(ev) {
    return this.run(new EventSequence([ev]));
  }
}

function prefixKeyHandler(evs) {
  message(Key.stringify(evs));
}
Keymap.prototype[Key.symbol.prefixKeyHandled] = prefixKeyHandler;

function commandMissingHandler(evs) {
  if (evs.length > 1) {
    message(`${Key.stringify(evs)} is undefined`);
  }
}
Keymap.prototype[Key.symbol.commandMissing] = commandMissingHandler;

// const AsyncFunction = (async () => {}).constructor;
xpd.command = new Map();
xpd.commandFromFunction = new Map();

// function functionNameToCommandName(name) {
//   return name.replace(/([A-Z]+(?:(?=[A-Z][a-z])|$)|[A-Z][a-z]*)/g, "-$1").toLowerCase();
// }

function interactive(f, document, scope, options = {}) {
  const command = new Command(f, {document, scope, ...options});

  xpd.command.set(command.name, command);
  xpd.commandFromFunction.set(f, command);

  return command;
}

function commandExists(command) {
  return xpd.command.has(command);
}

function defaultAsyncHandler(command) {
  return er => message(`error in async command \`${command.name}\': ${er}`);
}

function callInteractively(commandName, ev) {
  if (commandExists(commandName)) {
    let command = xpd.command.get(commandName);
    if (command.isAsync()) {
      command.exec(ev).catch(defaultAsyncHandler(command));
      return undefined;
    }
    else {
      return command.exec(ev);
    }
  }
  else {
    throw new XPDError("command `" + commandName + "' is not defined");
  }
}

function isTheForm(obj) {
  return obj && getWrappedJSObject(obj) === $f;
}

function isInnerEvent(e) {
  return isTheForm(e.target.form);
}

function getFontSize() {
  const style = $w.getComputedStyle($d.documentElement).fontSize;

  if (!/px$/.test(style)) {
    console.warn("font-sizeにpx以外の単位が使われています: %s", style);
  }

  return parseFloat(style);
}
xpd.fontSize = getFontSize();

xpd.pref.modeLineColor = "d0d0d0";

function createModeLine() {
  const height = getFontSize();

  const base = $d.createElement("div");
  base.id = "mode-line-background";
  base.setAttribute("style", "position: fixed; z-index: -1; width: 100%; left: 0em; bottom: 1em; white-space: pre");
  base.style.fontFamily = "Monaco, monospace";
  const pref = currentBuffer().pref;
  base.style.backgroundColor = pref.modeLineColor;
  if (pref.descriptiveMode) {
    base.title = "有効になっているモードの略称が表示されます";
  }
  base.style.lineHeight = height + 2 + "px";
  const div = $d.createElement("span");
  div.id = "mode-line";
  div.setAttribute("style", "margin-left: 3em");
  base.appendChild(div);
  $d.body.appendChild(base);
}

const modeTable = {};
function defineMode(f, lighter, doc) {
  const isFunc = typeof(f) === "function";
  const name = isFunc ? f.name.slice(1) : f;
  const commandName = KeymapEventListener.camelCaseToKebabCase(name);
  modeTable[name] = lighter;
  const init = function () {
    const pref = currentBuffer().pref;
    isFunc && f(pref[name]);
  };
  const modeFunc = function (on) {
    const pref = currentBuffer().pref;
    pref[name] = on == null ? !pref[name] : Boolean(on);
    init();
    drawModeLine();
  };
  const commandFunc = function () {
    const pref = currentBuffer().pref;
    modeFunc();
    message(commandName + " " + (pref[name] ? "enabled" : "disabled"));
  };
  initializeHooks.push(init);
  interactive(commandFunc, doc, null, {name: commandName});
  return modeFunc;
}


xpd.pref.modeLineMode = true;
function _modeLineMode(on) {
  $d.getElementById("mode-line").style.display = on ? "" : "none";
}
const modeLineMode = defineMode(_modeLineMode, null, "モード行を表示するモード");

function drawModeLine() {
  if (currentBuffer().pref.modeLineMode) {
    const ary = [];
    const pref = currentBuffer().pref;
    for (const name in modeTable) {
      const lighter = modeTable[name];
      if (lighter && pref[name]) {
        ary.push(lighter);
      }
    }
    $d.getElementById("mode-line").textContent = "No." + getNumber() + "    (" + ary.reverse().join(" ") + ")";
  }
}

// --- StyleSheet ---
xpd.styleSheet = (() => {
  const element = $d.createElement('style');
  $d.querySelector('head').appendChild(element);
  return element.sheet;
})();

// --- Command Input Command ---
var isMinibuffer;

function createMiniBuffer() {
  const mini = createInput({id: "mini-buffer", name: "minibuffer", type: "text", size: 32});
  isMinibuffer = function(obj) { return getWrappedJSObject(obj) === mini; };
  mini.style.display = "none";
  $f.appendChild(mini);
  xpd.styleSheet.insertRule("#mini-buffer{margin-left: 1em}", 0);
}

var commandTarget = null;
function displayMinibuffer(e) {
  const mini = $d.getElementById("mini-buffer");
  mini.value = "";
  mini.style.display = "";
  mini.focus();
  commandTarget = e.target;
}

function blurIfHtmlElement(element) {
  if (element == document.documentElement) {
    element.blur();
  }
}

function quitCommand(e) {
  if (commandTarget) {
    commandTarget.focus();
    const mini = $d.getElementById("mini-buffer");
    mini.style.display = "none";
    blurIfHtmlElement(commandTarget);
    commandTarget = null;
  }
  message("Quit");
}

function executeCommand(e) {
  const mini = $d.getElementById("mini-buffer");
  if (mini.id == e.target.id) {
    if (commandExists(mini.value)) {
      const event = {target: commandTarget};
      mini.style.display = "none";
      commandTarget.focus();
      callInteractively(mini.value, event);
      blurIfHtmlElement(commandTarget);
      commandTarget = null;
    }
    else {
      complete({target: mini});
    }
  }
  return false;
}

const documentKeymap = new Keymap("document");
const formKeymap = new Keymap("form", documentKeymap);
var documentKeymapObserver;
var formKeymapObserver;

// --- GUI Hooks ---
function setHP() {
  for (let i = 0; i < 6; i++) {
    const no = nameToIndex($f["POKE" + i].value);
    let hp;
    if (no >= 0) {
      const lv = parseInt($f["LV" + i].value, 10);
      const ef = parseInt($f["EF" + i + "_" + 0].value, 10);
      if (isNaN(lv) || lv < 1 || lv > 100 || isNaN(ef)) {
        hp = "";
      }
      else {
        hp = calcHP(no, lv, calcHPId(getId(i)), ef);
        if (currentBuffer().pref.highlightFormMode &&
            hp % 4 === 0 &&
            getMoves(i).some(s => s == "みがわり")) {
          hp = '<span style="color: orangered; font-weight: bold">' + hp + '</span>';
        }
      }
    }
    else {
      hp = "";
    }
    $d.getElementById("hp" + i).innerHTML = hp;
  }
}

function setSex() {
  const form = $f;
  for (let i = 0; i < 6; i++) {
    let str;
    try {
      const female = pokelist[nameToIndex(form["POKE" + i].value)].female;
      if (female < 0) {
        str = "　";
      }
      else if (female > Number("0x" + form["KO" + i].value.slice(0, 1))) {
        str = "♀";
      }
      else {
        str = "♂";
      }
    }
    catch (e) {
      str = "　";
    }
    $d.getElementById("sex" + i).innerHTML = str;
  }
}

function getMove(i, j) {
  return $f["WAZA" + i + "_" + j].value;
}

function getMoves(i) {
  const form = $f;
  const ary = new Array(4);
  for (let j = 0; j < ary.length; j++) {
    ary[j] = getMove(i, j);
  }
  return ary;
}

xpd.pref.hiddenpowerColorfulMode = true;
xpd.pref.hiddenpowerNames = ["格","飛","毒","地","岩","虫","霊","鋼","炎","水","草","電","エ","氷","竜","悪"];
xpd.pref.hiddenpowerColors = ["#d0a0a0", "#d0ffd0", "#c080ff", "#f0a060", "#d0d0a0", "#80d080", "#b0a0e0", "#e0e0e0", "#ffa0a0", "#a0a0ff", "#a0ffa0", "#ffffa0", "#ffa0ff", "#c0c0ff", "#ffa060", "#909090"];
function setHiddenpower() {
  const pref = currentBuffer().pref;
  const form = $f;
  for (let i = 0; i < 6; i++) {
    let str = "　";
    let color = "e0e0e0";
    try {
      if (getMoves(i).map(moveToIndex).some(function (i) { return i == 238; })) {
        /* 個体値から計算 */
        const ary = getId(i);
        str = pref.hiddenpowerNames[parseInt(ary[0], 16) % 4 * 4 + parseInt(ary[1], 16) % 4];
        if (pref.hiddenpowerColorfulMode) {
          color = pref.hiddenpowerColors[parseInt(ary[0], 16) % 4 * 4 + parseInt(ary[1], 16) % 4];
        }
      }
    }
    catch (e) {
      handleInteractiveError(e);
    }
    const hid = $d.getElementById("hiddenpower" + i);
    hid.innerHTML = str;
    hid.bgColor = color;
  }
}

function _hiddenpowerColorfulMode(on) {
  setHiddenpower();
}
const hiddenpowerColorfulMode = defineMode(_hiddenpowerColorfulMode, "HC", "めざめるパワーを色で強調");

function setStatus() {
  try {
    setSex();
    setHP();
  }
  catch (e) {
    message(e);
  }
}

function setBackgroundColor() {
  for (let n = 0; n < 6; n++) {
    setStatusBackgroundColor($f["KO" + n]);
    for (let i = 0; i < 5; i++) {
      setStatusBackgroundColor($f["EF" + n + "_" + i]);
    }
  }
}

function formRefresh() {
  setStatus();
  setHiddenpower();
  setBackgroundColor();
}

function change() {
  try {
    setPoke();
    setPD();
  } catch (e) {
    handleInteractiveError(e);
    return false;
  }
  return true;
}

/*
 * cookieの上限は8192ぐらい
 *  一つのパーティが占めるcookieの長さの最大は487
 * 2000のパなら481
 * 削除されたパで6
 * 通常は460程度
 */

function newPartyButton() {
  if ($d.cookie.length > 7700) {
    message("パーティが多すぎます");
    return;
  }
  if (change()) {
    let i;
    for (i = 1; getCookie(i); i++);
    setCookie("PD" + (i - 1), "1_x_" + getPD());
    message("Saved No." + i);
  }
}

/*
function saveSomeBuffers() {

}*/

function save() {
  if (change()) {
    setCookie("PD" + (getNumber() - 1), "1_x_" + getPD());
    message("Saved No." + getNumber());
  }
  return false;
}

// --- GUI Hooks:Rearrenge ---
function swapValue(a, b) {
  const temp = a.value;
  a.value = b.value;
  b.value = temp;
}

function swapPoke() {
  const ary = [];
  for (let i = 0; i < 6; i++) {
    if ($f["swap" + i].checked) ary.push(i);
  }
  if (ary.length == 2) {
    const attrs = ["LV", "POKE", "ITEM", "KO"];
    for (let i = 0; i < attrs.length; i++) {
      swapValue($f[attrs[i] + ary[0]], $f[attrs[i] + ary[1]]);
    }
    for (let i = 0; i < 4; i++) {
      swapValue($f["WAZA" + ary[0] + "_" + i], $f["WAZA" + ary[1] + "_" + i]);
    }
    for (let i = 0; i < 5; i++) {
      swapValue($f["EF" + ary[0] + "_" + i], $f["EF" + ary[1] + "_" + i]);
    }
    formRefresh();
    for (let i = 0; i < 6; i++) {
      $f["swap" + i].checked = false;
    }
  }
}

// --- GUI ---
xpd.pref.descriptiveMode = true;
function getTable() {
  return $d.getElementsByTagName('table')[0];
}

xpd.pref.formPokeWidth = (xpd.fontSize - 1) * 5;
function createPokeInput(text, no){
  const input = $d.createElement('input');
  input.value = text;
  input.style.width = currentBuffer().pref.formPokeWidth;
  input.setAttribute("name", "POKE" + no);
  return input;
}

function setInputs() {
  const table = getTable();
  for (let i = 1; i < 7; i++) {
    const row = table.rows[i].cells;
    const cell = table.rows[i].cells[1];
    cell.replaceChild(createPokeInput(cell.innerHTML, i - 1), cell.firstChild);
  }
}

function setButtonAttr(b, fn, value, title) {
  b = getWrappedJSObject(b);
  b.onclick = exportUnsafe(fn);
  if (value) {
    b.value = value;
  }
  if (currentBuffer().pref.descriptiveMode) {
    b.title = title ?? "undocumented";
  }
}

function setButtons() {
  const b = $d.getElementsByName("submit");
  b[0].type = "button";
  setButtonAttr(b[0], change);
  b[1].type = "button";
  b[2].type = "button";
  setButtonAttr(b[1], save, "上書保存", "パーティを保存します。");
  setButtonAttr(b[2], newPartyButton, "新規保存", "新規保存");
  $f.appendChild(createInput({type: "hidden", name: "C", value: ""}));
}

function addEventListenerUnsafe(dom, evname, listener) {
  return getWrappedJSObject(dom).addEventListener(evname, exportUnsafe(listener), false);
}

xpd.pref.formLowStatusStyle = "#C0FFC0";
xpd.pref.formVeryLowStatusStyle = "#A0FFFF";
function setStatusBackgroundColor(ev) {
  const target = ev.target ?? ev;
  const value = target.value;
  const name = target.name;
  const max = /^KO/.test(name) ? "FFFF" : (/^EF/.test(name)) ? "63" : null;
  if (currentBuffer().pref.highlightFormMode && max && value != max) {
    target.style.backgroundColor = (value.length == 4 ? /[0-7]/ : /^0$/).test(value) ? xpd.pref.formVeryLowStatusStyle : xpd.pref.formLowStatusStyle;
  }
  else {
    target.style.backgroundColor = "";
  }
}

xpd.pref.highlightFormMode = true;
const setStatusBGUnsafe = exportUnsafe(setStatusBackgroundColor);
function _highlightFormMode(on) {
  const m = on ? "addEventListener" : "removeEventListener";
  const refresh = on ? setStatusBGUnsafe : function(obj) { obj.style.backgroundColor = ""; };
  function f(obj) {
    getWrappedJSObject(obj)[m]("change", setStatusBGUnsafe);
    refresh(obj);
  }
  for (let i = 0; i < 6; i++) {
    f($f["KO" + i]);
    for (let j = 0; j < 5; j++) {
      f($f["EF" + i + "_" + j]);
    }
  }
  setHP();
};
const highlightFormMode = defineMode(_highlightFormMode, "HF", "テキストボックスを強調表示するモード");

function wheelListener(ev) {
  let target = ev.target;
  let name = target.name;
  let [min, max] = /^LV/.test(name) ? [1, 100] : [0, 63];
  target.value = Math.max(min,
                          Math.min(max,
                                   Number(target.value) - Math.round(ev.deltaY / 5)));
  setStatusBackgroundColor(target);
  if (/^(?:LV|EF.*0$)/.test(name)) {
    setHP();
  }
  ev.preventDefault();
}

function setOnChange() {
  for (let i = 0; i < 6; i++) {
    addEventListenerUnsafe($f["POKE" + i], "blur", setStatus);
    addEventListenerUnsafe($f["KO" + i], "blur", formRefresh);
    addEventListenerUnsafe($f["LV" + i], "blur", setHP);
    addEventListenerUnsafe($f["LV" + i], "wheel", wheelListener);
    addEventListenerUnsafe($f["EF" + i + "_0"], "blur", setHP);
    for (let j = 0; j < 4; j++) {
      addEventListenerUnsafe($f["WAZA" + i + "_" + j], "blur", setHiddenpower);
    }

    const ko = $f["KO" + i];
    setStatusBackgroundColor(ko);
    for (let j = 0; j < 5; j++) {
      const ef = $f["EF" + i + "_" + j];
      addEventListenerUnsafe(ef, "wheel", wheelListener);
      setStatusBackgroundColor(ef);
    }
  }
}

xpd.pref.formEffortWidth = xpd.fontSize * 2;
function createEffortColumn() {
  const table = getTable();
  table.rows[0].insertCell(-1);
  table.rows[0].cells[8].innerHTML = "HPこぼすと";
  for (let i = 0; i < 6; i++) {
    const row = table.rows[i + 1];
    row.insertCell(8);
    for (let j = 0; j < 5; j++) {
      row.cells[8].appendChild(createInput(
        {
          value: currentBuffer().party[i].ef[j],
          name: "EF" + i + "_" + j,
          maxLength: 2
        },
        {
          width: xpd.pref.formEffortWidth
        }));
    }
  }
}

function createHiddenpowerColumn() {
  const table = getTable();
  table.rows[0].insertCell(7);
  table.rows[0].cells[7].innerHTML = "め";
  for (let i = 1; i < 7; i++) {
    const row = table.rows[i];
    row.insertCell(7);
    row.cells[7].id = "hiddenpower" + (i - 1);
    row.cells[7].bgColor = "e0e0e0";
  }
}

function createHPColumn() {
  const table = getTable();
  table.rows[0].insertCell(7);
  table.rows[0].cells[7].innerHTML = "HP";
  for (let i = 1; i < 7; i++) {
    const row = table.rows[i];
    row.insertCell(7);
    row.cells[7].id = "hp" + (i - 1);
    row.cells[7].bgColor = "e0e0e0";
  }
}

function createSexColumn() {
  const table = getTable();
  table.rows[0].insertCell(2);
  table.rows[0].cells[2].innerHTML = "　";
  for (let i = 1; i < 7; i++) {
    const row = table.rows[i];
    row.insertCell(2);
    row.cells[2].id = "sex" + (i - 1);
    row.cells[2].bgColor = "e0e0e0";
  }
}

function createSwapCheckBox() {
  const table = getTable();
  table.rows[0].insertCell(0);
  table.rows[0].cells[0].innerHTML = "";
  table.rows[0].cells[0].bgColor = "snow";

  for (let i = 0; i < 6; i++) {
    const row = table.rows[i + 1];
    row.insertCell(0);
    const attr = {
      type: "checkbox",
      name: "swap" + i,
      onchange: exportUnsafe(swapPoke)
    };
    if (currentBuffer().pref.descriptiveMode) {
      attr.title = "2つチェックすると、それらの行を入れ替えます。";
    }
    row.cells[0].appendChild(createInput(attr));
    table.rows[i + 1].cells[0].bgColor = "snow";
  }
}

function stripTableHeader() {
  const table = getTable();
  for (let k = 1; k < 7; k++) {
    const cell = table.rows[0].cells[k];
    cell.innerHTML = cell.innerHTML.replace(/　/g, "");
  }
}

xpd.pref.formLvWidth = (xpd.fontSize * 3 / 4) * 3;
function fixLvSize() {
  const pref = currentBuffer().pref;
  if (pref.formLvSize != $f.LV0.size) {
    for (let i = 0; i < 6; i++) {
      $f["LV" + i].style.width = pref.formLvWidth;
    }
  }
}

xpd.pref.formKoWidth = (xpd.fontSize * 3 / 4) * 4;
function fixKoSize() {
  const pref = currentBuffer().pref;
  if (pref.formKoSize != $f.KO0.size) {
    for (let i = 0; i < 6; i++) {
      $f["KO" + i].style.width = pref.formKoWidth;
    }
  }
}

xpd.pref.formItemWidth = (xpd.fontSize - 1) * 8;
function fixItemSize() {
  const pref = currentBuffer().pref;
  if (pref.formItemSize != $f.ITEM0.size) {
    for (let i = 0; i < 6; i++) {
      $f["ITEM" + i].style.width = pref.formItemWidth;
    }
  }
}

xpd.pref.formMoveWidth = (xpd.fontSize - 1) * 7;
function fixMoveSize() {
  const pref = currentBuffer().pref;
  if (pref.formMoveSize != $f.WAZA0_0.size) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        $f["WAZA" + i + "_" + j].style.width = pref.formMoveWidth;
      }
    }
  }
}

function fixFormSizes() {
  fixLvSize();
  fixKoSize();
  fixItemSize();
  fixMoveSize();
}

function setTableStyleNowrap() {
  const element = $d.createElement('style');
  element.appendChild($d.createTextNode(''));
  $d.getElementsByTagName('head')[0].appendChild(element);
  element.sheet.insertRule("td{white-space:nowrap;}", 0);
}

// --- Command ---
function getLineNumber(input) {
  const n = /\d/.exec(input.name);
  if (n === null) {
    throw new ImplementationError("wrong argument: " + input + "(" + input.name + ")");
  }
  else {
    return Number(n[0]);
  }
}

// --- Command:System ---
function version() {
  message(`${xpd.version} (${xpd.browser}, ${xpd.platform})`);
}
interactive(version, "バージョンを表示");

var backButton;
function back() {
  backButton && backButton.click();
  return false;
}
interactive(back, "前画面へ戻る");

function initializeBackButton() {
  const buttons = $d.getElementsByName("submit");
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].value == "戻る") {
      backButton = buttons[i];
      return;
    }
  }
  console.warn("戻るボタンが見つかりません");
  backButton = null;
}

interactive(save, "保存");

function quit() {
  if (bufferMap.some(function (buf) { return buf.changes(); })) {
    if (!confirm("編集されています。終了しますか？")) {
      return false;
    }
  }
  $d.location = "http://psense.lib.net/_/PDINPUT.cgi";
  return false;
}
interactive(quit, "パーティ一覧に戻る");

function newParty() {
  const b = $d.getElementsByName("submit")[2];
  if (b.value != "再現") {
    throw new ImplementationError("再現ボタンがみつかりません(value=\"" + b.value + "\")");
  }
  b.click();
  return false;
}
interactive(newParty, "新規保存");

function deleteAllParties() {
  if (confirm("パーティを全て削除します。よろしいですか？\n(No.1のパーティは残されます。対応するバッファも削除されます))")) {
    findParty0(1);
    getCookies().forEach(function(_, i) {
      if (i > 0) {
        const name = i + 1;
        getBuffer(name) && bufferMap.remove(name);
        deleteCookie("PD" + i);
      }
    });
  }
}
interactive(deleteAllParties, "全てのパーティを削除");

function revert() {
  if (confirm("編集を破棄して保存時の状態を復帰します。よろしいですか？")) {
    partyReflectForm(loadParty(getNumber()));
  }
}
interactive(revert, "保存時の状態を復帰");

/*export*/
function exportPD() {
  setPoke();
  messageWithTextbox(getPD());
}
interactive(exportPD, "PD値を書き出す");

/*import*/
function pdToParty(pd) {
  const poke = new Array(getPokeNum());
  const ary = pd.split("_x_");
  for (let i = 0; i < poke.length; i++) {
    poke[i] = Poke.fromPD(ary[i]);
  }
  return poke;
}
function importPD() {
  let pd = prompt("PD-string");
  if (pd) {
    let ma;
    if ((ma = /^1_x_(.*)$/.exec(pd))) {
      pd = ma[1];
    }
    if (!/^1(?:_x_(?:\d{1,3}_){2}(?:[0-9a-f]_){4}(?:\d{1,2}_){5}(?:\d{1,3}_){4}(?:\d{1,2}_){4}(?:[0-3]_){4}\d{1,3}_0_\d{1,3}){6}/i.exec("1_x_" + pd)) {
      throw new InvalidInput("PD値が正しくありません");
    }
    partyReflectForm(pdToParty(pd));
  }
}
interactive(importPD, "PD値を読み込む");

function partiesToTable(parties) {
  function tr(s) { return '<tr>' + s + "</tr>"; }
  function td(s) { return "<td>" + s + "</td>"; }
  return '<table border="1" style="font-size: smaller">' +
      parties.map(function (party, i) {
        return tr(td("No." + (i + 1)) +
                  party.map(function (poke) {
                    return td(poke.lv + " " + pokelist[poke.no].name);
                  }).join(" "));
      }).join("") + "</table>";
}

function listParties() {
  message(partiesToTable(loadParties()));
}
interactive(listParties, "パーティ一覧を表示");

function findParty0(num) {
  if (num) {
    let buf;
    try {
      buf = getBuffer(num) ?? makeBuffer(num, loadParty(num));
    }
    catch (e) {
      if (e instanceof NoPartyError) {
        throw new PartyNotFound(num);
      }
      else {
        throw e;
      }
    }
    selectBuffer(buf);
  }
}

function findParty() {
  const num = parseInt(prompt("party number"));
  if (isNaN(num)) {
    message("数字で入力して下さい");
  }
  else {
    findParty0(num);
  }
}
interactive(findParty, "パーティを開く");

function findAlternateParty() {
  const old = currentBuffer();
  if (old.changes() && !confirm("編集されています。閉じますか？")) {
    return;
  }
  const num = prompt("party number")-0;
  if (num) {
    let buf;
    if ((buf = getBuffer(num))) {
      if (currentBuffer() != buf) {
        selectBuffer(buf);
        killBuffer0(old);
      }
    }
    else {
      try {
        selectBuffer(makeBuffer(num, loadParty(num)));
        killBuffer0(old);
      }
      catch (e) {
        if (e instanceof NoPartyError) {
          throw new PartyNotFound(num);
        }
        else {
          throw e;
        }
      }
    }
  }
}
interactive(findAlternateParty, "現在のバッファを破棄してパーティを開く");

function writeParty() {
  setPoke();
  const max = $d.cookie.split(";").length;
  const name = prompt("保存先(1-" + max + "):");
  if (name === "") {
    return;
  }
  const no = parseInt(name);
  if (isNaN(no) || no < 1 || no > max) {
    throw new UserError("1から" + max + "の番号を入力してください。");
  }
  const oldpd = getCookie(name);
  if (oldpd == null || confirm(name + "を上書きします。よろしいですか？")) {
    const oldbuf = currentBuffer();
    const buf = getBuffer(name);
    if (oldbuf === buf) {
      save();
    }
    else {
      const pd = getPD();
      setCookie("PD" + (no - 1), "1_x_" + pd);
      if (buf) {
        selectBuffer(buf);
        partyReflectForm(pdToParty(pd));
      }
      else {
        selectBuffer(makeBuffer(no, pdToParty(pd)));
      }
      killBuffer0(oldbuf);
      message("Saved No." + no);
    }
  }
}
interactive(writeParty, "上書き保存");

function withBuffer(name, f) {
  const buf = getBuffer(name);
  if (buf) {
    return f(buf);
  }
  else {
    throw new BufferNotFound(name);
  }
}

function withBufferReadBufferName(f) {
  const name = prompt("buffer: ");
  return name ? withBuffer(name, f) : null;
}

function switchToBuffer() {
  withBufferReadBufferName(selectBuffer);
}
interactive(switchToBuffer, "バッファを切り替える");

function listBuffers() {
  const obj = {};
  obj.map = function (f) { return bufferMap.map(function (buf, no) { return f(buf.party, no - 1); }); };
  message(partiesToTable(obj));
}
interactive(listBuffers, "バッファ一覧を表示");

function killBuffer() {
  withBufferReadBufferName(function (buf) {
    if (!(buf.changes() && !confirm("編集されています。閉じますか？"))) {
      killBuffer0(buf);
    }
  });
}
interactive(killBuffer, "指定したバッファを閉じる");

function killCurrentBuffer() {
  const buf = currentBuffer();
  if (!(buf.changes() && !confirm("編集されています。閉じますか？"))) {
    killBuffer0(buf);
  }
}
interactive(killCurrentBuffer, "現在のバッファを閉じる");

function nextBuffer() {
  selectBuffer(bufferMap.next());
}
interactive(nextBuffer, "次のバッファへ移動");

function previousBuffer() {
  selectBuffer(bufferMap.previous());
}
interactive(previousBuffer, "前のバッファへ移動");

// --- Command:Completion ---
function min(x, y) {
  return x < y ? x : y;
}

xpd.pref.smartCompletionMode = true;
const smartCompletionMode = defineMode("smartCompletionMode", "SC", "効果のないアイテムを補完しないモード");

function commonPrefix(s, t) {
  const len = min(s.length, t.length);
  let i;
  for (i = 0; i < len && s[i] == t[i]; i++);
  return s.substring(0, i);
}

roma.suffixes = ["a", "i", "u", "e", "o", "ya", "yi", "yu", "ye", "yo", "ha", "hi", "hu", "he", "ho", "wa", "wi", "wu", "we", "wo"];

function regexpQuote(str){
  return str.replace(/[$(-+.?\[-^{-}]/g, "\\$&");
};

function makeCompleteRegAryWithSuffix(base, sufs, flag, len) {
  base = regexpQuote(base.toString());
  const regary = flag ? [roma(base).toString()] : [];
  len = len ?? sufs.length;
  for (let i = 0; i < len; i++) {
    const temp = roma(base + sufs[i]).toString();
    if (temp[0] == "[" && temp[temp.length - 1] == "]") {
      regary.push(temp);
    }
  }
  return regary;
}

function makeCompleteRegExp(str) {
  let regbase;
  let regary;
  let ma;
  str = normalizeNobashi(str);

  if (/[^n]n$/.test(str)) {
    regbase = str.slice(0, -1);
    regary = makeCompleteRegAryWithSuffix("n", roma.suffixes, true, 10);
  }
  else if (!/nn$/.test(str) && (ma = /[b-df-hj-np-tv-z]+$/.exec(str))) {
    if (/[^b-df-hj-np-tv-z][b-df-hj-np-tv-z]$/.test(str)) {
      regbase = str.slice(0, -1);
      regary = makeCompleteRegAryWithSuffix(ma, roma.suffixes).concat(
        makeCompleteRegAryWithSuffix(ma + ma, roma.suffixes));
    }
    else {
      regbase = RegExp.leftContext;
      regary = makeCompleteRegAryWithSuffix(ma, roma.suffixes);
    }
    regary.push(str.substr(-1, 1)); /* 最後の文字そのもの */

    /* ポケモン用 最後の♂♀をmfで入力 */
    if ("m" == str[str.length - 1]) {
      regary.push(roma(regexpQuote(ma.toString().slice(0, -1))).toString() + "♂");
    }
    else if ("f" == str[str.length - 1]) {
      regary.push(roma(regexpQuote(ma.toString().slice(0, -1))).toString() + "♀");
    }
  }
  else {
    return new RegExp("^" + roma(regexpQuote(str)).toString());
  }
  return new RegExp("^" + roma(regexpQuote(regbase)).toString() + "(?:" + regary.join("|") + ")");
}

function completeFromDataArray(data, node) {
  const re = makeCompleteRegExp(node.value);
  const ary = [];
  for (const i in data) {
    if (re.test(data[i].name)) {
      ary.push(data[i].name);
    }
  }
  return ary;
}

function completeFromPoke(node) {
  return completeFromDataArray(pokelist, node);
}

function completeFromMove(node) {
  // hack
  const ju_re = /^j(?:u(?:u(?:m(?:a(?:nn?(?:b(?:o(?:[rl](?:u(?:to?)?)?)?)?)?)?)?)?)?)?$/;
  const ary = completeFromDataArray(movelist, node);
  if (ju_re.test(node.value)) {
    ary.push("１０まんボルト");
  }
  return ary;
}

function completeFromItem(node) {
  return completeFromDataArray(currentBuffer().pref.smartCompletionMode ? effectiveItems : itemlist, node);
}

function makeMinibufferCompleteRegexp(str) {
  try {
    return RegExp("^" + regexpQuote(str));
  }
  catch (e) {
    let ma;
    if (/^unterminated character class/.exec(e.message)) {
      throw new InvalidInput("[Incomplete input]");
    }
    else if ((ma = /^invalid quantifier (.*)/.exec(e.message))) {
      throw new InvalidInput("[Invalid quantifier " + ma[1] + "]");
    }
    else {
      throw new InvalidInput("[Error]: " + e.message);
    }
  }
}

function completeFromCommand(node) {
  const re = makeMinibufferCompleteRegexp(node.value);
  const ary = [];
  const insideFormFlag = isTheForm(commandTarget.form) && /\d/.test(commandTarget.name);
  for (const [name, command] of xpd.command) {
    if (command.scope === "document" || insideFormFlag) {
      if (re.test(name)) {
        ary.push(name);
      }
    }
  }
  return ary;
}

function nodeKind(node) {
  return node.name.substring(0, 4);
}

function finishesCompeletion(node) {
  const kind = nodeKind(node);
  const source = {
    POKE: nameToIndex,
    WAZA: moveToIndex,
    ITEM: itemToIndex,
    mini: function (command) {
      return xpd.command.hasOwnProperty(command) ? -1 : 1;
    }
  };
  return source[kind](node.value) != -1;
}

function defaultCompleter(node) {
  return defaultCompleter.sourceTable[nodeKind(node)];
}

defaultCompleter.sourceTable = {
  POKE: completeFromPoke,
  WAZA: completeFromMove,
  ITEM: completeFromItem,
  mini: completeFromCommand
};

/* modestly: 真なら"かみなり"等のとき補完しない(C-n等で移動時の自動補完用)。 */
function completeGetCandidates(node, modestly, completer) {
  completer = completer ?? defaultCompleter(node);

  if (completer && !(modestly && finishesCompeletion(node))) {
    return completer(node).sort();
  }
  else {
    return null;
  }
}

/*
 * completeGetCandidates の引数に情報源を追加
 * 情報源
 * messenger
 */

xpd.pref.completeListingMax = 100;
function createCandidatesMessage(target, cand) {
  const completeByMessage = exportUnsafe(ev => void(target.value = ev.target.textContent));
  if (cand.length <= currentBuffer().pref.completeListingMax) {
    let p = $d.createElement("p");
    p.style.columnCount = "auto";
    p.style.width = document.getElementsByTagName("table")[0].clientWidth;
    p.style.wordBreak = "keep-all";
    let maxlen = 0;
    cand.forEach(function (mes) {
      if (mes.length > maxlen) {
        maxlen = mes.length;
      }
      let text = $d.createElement("a");
      text.textContent = mes;
      text.addEventListener("click",
                            completeByMessage,
                            false),
      p.appendChild(text),
      p.appendChild($d.createElement("br"));
    });

    // 段組み分からないので ad-hoc 対応
    p.style.columnWidth = maxlen <= 8 ? "10em" : "16em";
    return p;
  }
  else {
    return "[" + cand.length.toString() + " possibilities]";
  }
}

function complete(e, modestly) {
  const node = e.target;
  const ary = completeGetCandidates(node, modestly);
  if (ary != null) {
    let r = ary[0];
    if (ary.length > 1) {
      for (let i = 1; i < ary.length; i++) {
        r = commonPrefix(r, ary[i]);
        if (r == "") {
          break;
        }
      }
      /* kir で キ にしてしまわないように(キrとはならない) */
      if ((isMinibuffer(node) ? makeMinibufferCompleteRegexp : makeCompleteRegExp)(node.value).test(r)) {
        node.value = r;
      }
    }
    else if (ary.length == 1) {
      node.value = ary[0];
    }
    message(ary.length == 0 ? "[No match]" :
            ary.length == 1 ? "[Sole completion]" :
            createCandidatesMessage(e.target, ary));
  }
  return ary;
}

function completeCommand(e) {
  complete(e, false);
  return false;
}

// --- Command:Movement ---
function nextLine(e) {
  complete(e, true);
  const target = e.target;
  if (isMinibuffer(target)) {
    return false;
  }
  const n = Number(/\d/.exec(target.name)[0]);
  $f[RegExp.leftContext + (n + 1) % 6 + RegExp.rightContext].select();
  return false;
}
interactive(nextLine, "次の行へ移動", "form");

function previousLine(e) {
  complete(e, true);
  const target = e.target;
  if (isMinibuffer(target)) {
    return false;
  }
  const n = Number(/\d/.exec(target.name)[0]);
  $f[RegExp.leftContext + (n + 5) % 6 + RegExp.rightContext].select();
  return false;
}
interactive(previousLine, "前の行へ移動", "form");

const textboxIndexes = {};
const textboxes = [];

function initializeTextboxIndexes() {
  const t = $d.getElementsByTagName("input");
  for (let i = 0; i < t.length; i++) {
    if (t[i].type == "text") {
      textboxIndexes[t[i].name] = textboxes.length;
      textboxes.push(t[i]);
    }
  }
  textboxes[-1] = textboxes[textboxes.length - 1];
  textboxes[textboxes.length] = textboxes[0];
}

function forwardTextbox(e) {
  complete(e, true);
  const target = e.target;
  if (isMinibuffer(target)) {
    return false;
  }
  textboxes[textboxIndexes[target.name] + 1].select();
  return false;
}
interactive(forwardTextbox, "前方のテキストボックスへ移動", "form");

function backwardTextbox(e) {
  complete(e, true);
  const target = e.target;
  if (isMinibuffer(target)) {
    return false;
  }
  textboxes[textboxIndexes[target.name] - 1].select();
  return false;
}
interactive(backwardTextbox, "後方のテキストボックスへ移動", "form");

const lineWidth = 13;
xpd.pref.blockStartIndexes = [1, 2, 7];

function findIndexN(ary, f) {
  for (let i = 0; i < ary.length; i++) {
    if (f(ary[i], i, ary)) {
      return i;
    }
  }
  return i;
}

function currentBlockIndex(name) {
  const indexes = currentBuffer().pref.blockStartIndexes;
  const k = textboxIndexes[name] % lineWidth;
  return findIndexN(indexes, function(i) {
    return k < i;
  }) - 1;
}

function switchBlock(e) {
  complete(e, true);
  const target = e.target;
  const name = target.name;
  if (isMinibuffer(target)) {
    return false;
  }
  const index = textboxIndexes[name];
  const blockIndex = currentBlockIndex(name);
  const blockIndexes = currentBuffer().pref.blockStartIndexes;
  const len = blockIndexes.length;

  const base = index - index % lineWidth;
  const newBlockIndex = blockIndex == len - 1 ? 0 : blockIndex + 1;

  textboxes[base + blockIndexes[newBlockIndex]].select();
  return false;
}
interactive(switchBlock, "ブロック単位で移動", "form");

function getBeginningOfLine(textbox) {
  const index = textboxIndexes[textbox.name];
  const base = index - index % lineWidth;
  return textboxes[base];
}

function beginningOfLine(e) {
  complete(e, true);
  const target = e.target;
  if (isMinibuffer(target)) {
    return false;
  }
  getBeginningOfLine(target).select();
  return false;
}
interactive(beginningOfLine, "行頭へ移動", "form");

// --- Command:TabCommand ---
function isTabKey(e) {
  return e.key === "Tab";
}

/*
 * 補完と移動の二つの役割をTABキーに持たせるコマンド。
 * ユーザが補完してほしいのか移動してほしいのかを状況から推測する。
 */
function completeForTabCommand0(e) {
  if (!defaultCompleter(e.target)) {
    return true;
  }
  else if (isMinibuffer(e.target)) {
    complete(e);
    return false;
  }
  else {
    if (!e.target.value) {
      return true;
    }
    const candidates = complete(e, true);
    if (candidates == null || candidates.length == 1) {
      return true;
    }
    else {
      return false;
    }
  }
}

function completeForTabCommand(e, back) {
  if (completeForTabCommand0(e)) {
    if (back) {
      return backwardTextbox(e);
    }
    else {
      return forwardTextbox(e);
    }
  }
  else {
    return false;
  }
}

function completeForTabCommand2(e) {
  return completeForTabCommand(e, true);
}

function beginningOfNextLine(e) {
  const target = e.target;
  if (isMinibuffer(target)) {
    executeCommand(e);
  }
  else {
    if (completeForTabCommand0(e)) {
      getWrappedJSObject(target.form)["POKE" + (getLineNumber(target) + 7) % 6].select();
    }
  }
  return false;
}
interactive(beginningOfNextLine, "次の行の種族へ移動", "form");

// --- Command:AutoCompletion ---
function autoMessageCandidates(e) {
  if (e.target.value) {
    const ary = completeGetCandidates(e.target);
    if (ary != null) {
      message(ary.length == 0 ? "[No match]" :
              ary.length == 1 ? ary[0] :
              createCandidatesMessage(e.target, ary));
    }
  }
  else {
    message("");
  }
}

xpd.pref.autoCompleteMode = true;
function initializeAutoCompleteMode() {
  addEventListenerUnsafe($f, "input", autoMessageCandidates);
}

// --- Command:Edit ---
function transposeMoves(e) {
  const src = e.target;
  let ma;
  if ((ma = /^(WAZA\d_)(\d)/.exec(src.name)) == null) {
    return;
  }
  const dest = $f[ma[1] + (Number(ma[2]) + 1 & 3)];
  const temp = src.value;
  src.value = dest.value;
  dest.value = temp;
  dest.select();
}
interactive(transposeMoves, "技の並び替え", "form");

xpd.pref.defaultLevel = 50;
xpd.pref.killLineKillPP = true;
function killLineN(n) {
  const pref = currentBuffer().pref;
  $f["LV" + n].value = pref.defaultLevel;
  $f["POKE" + n].value = "";
  for (let i = 0; i < 4; i++) {
    $f["WAZA" + n + "_" + i].value = "";
  }
  $f["ITEM" + n].value = "";
  $f["KO" + n].value = "FFFF";
  for (let i = 0; i < 5; i++) {
    $f["EF" + n + "_" + i].value = "63";
  }
  if (pref.killLineKillPP) {
    currentBuffer().party[n].p_up = [3, 3, 3, 3];
  }
}

function killLine(e) {
  const target = e.target;
  if (isMinibuffer(target)) {
    return false;
  }
  killLineN(getLineNumber(target));
  formRefresh();
  return false;
}
interactive(killLine, "一行削除", "form");

function clearAll() {
  for (let i = 0; i < 6; i++) {
    killLineN(i);
  }
  formRefresh();
}
interactive(clearAll, "全て削除");

// --- Command:Edit:Level ---
xpd.pref.setLevels = [50, 51, 52, 53, 54, 55, 5, 100, 50, 50];

function setLevelN(n, lv) {
  $f["LV" + n].value = lv;
}

function getLevelFromEvent(ev) {
  const ch = ev.key && Key.stringifyEvent(ev);
  return ch && /^[0-9]$/.test(ch) && xpd.pref.setLevels[ch];
}

function setLevelFromPrompt(ev) {
  const lv = parseInt(prompt("レベル 1-100"), 10);
  if (isNaN(lv) || lv < 1 || lv > 100) {
    throw new InvalidInput("1-100の数値を入力して下さい");
  }
  else {
    setLevelN(getLineNumber(ev.target), lv);
    return false;
  }
}
interactive(setLevelFromPrompt, "ダイアログでレベルを入力");

function setLevel(e) {
  const target = e.target;
  const lv = getLevelFromEvent(e);
  if (lv) {
    setLevelN(getLineNumber(target), lv);
    setHP();
  }
  else {
    setLevelFromPrompt(e);
  }
  return false;
}
interactive(setLevel, "レベルを入力", "form");

function setLevelAll0(lv) {
  for (let i = 0; i < 6; i++) {
    setLevelN(i, lv);
  }
  setHP();
}

function setLevelAllFromPrompt(ev) {
  const lv = parseInt(prompt("レベル 1-100"), 10);;
  if (isNaN(lv) || lv < 1 || lv > 100) {
    throw new InvalidInput("1-100の数値を入力して下さい");
  }
  else {
    setLevelAll0(lv);
    return false;
  }
}
interactive(setLevelAllFromPrompt, "ダイアログでレベル一括入力");

function setLevelAll(e) {
  const lv = getLevelFromEvent(e);
  if (lv) {
    setLevelAll0(lv);
  }
  else {
    setLevelAllFromPrompt(e);
  }
  return false;
}
interactive(setLevelAll, "レベル一括入力");

xpd.pref.toggleLevelTable = {
  50: 51,
  51: 50,
  53: 55,
  55: 53
};
function toggleLevelAll(e) {
  const form = $f;
  const table = currentBuffer().pref.toggleLevelTable;
  for (let i = 0; i < 6; i++) {
    const box = form["LV" + i];
    box.value = table[box.value];
  }
  return false;
}
interactive(toggleLevelAll, "55-50編成と53-51編成をトグル");

// --- Command:Utilities ---
// --- Command:Utilities:SpeedTable ---
var ruleTable = {};
ruleTable[2000] = [3, 6, 9, 12, 15, 18, 20, 22, 24, 25, 26, 28, 31, 34, 36, 38, 40, 45, 47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 83, 85, 87, 89, 91, 93, 94, 97, 99, 101, 103, 105, 106, 107, 108, 110, 112, 113, 114, 115, 119, 121, 122, 123, 124, 125, 126, 127, 128, 130, 131, 132, 134, 135, 136, 139, 141, 142, 143, 144, 145, 146, 148, 149, 154, 157, 160, 162, 164, 166, 168, 169, 171, 176, 178, 181, 182, 184, 185, 186, 189, 190, 192, 193, 195, 196, 197, 198, 199, 200, 201, 202, 203, 205, 206, 207, 208, 210, 211, 212, 213, 214, 215, 217, 219, 221, 222, 224, 225, 226, 227, 229, 230, 232, 233, 234, 235, 237, 241, 242, 243, 244, 245, 248];

xpd.pref.rule = 2000;
function eachPokeInRule(f) {
  const rule = currentBuffer().pref.rule;
  if (rule) {
    for (let i = 0; i < ruleTable[rule].length; i++) {
      f(pokelist[ruleTable[rule][i]]);
    }
  }
  else {
    for (let i = 1; i < pokelist.length; i++) {
      f(pokelist[i]);
    }
  }
}

function makeSpeedTableBases() {
  const speedList = [];
  const speed2pokes = {}; /* spd -> array of pokedata */

  eachPokeInRule(function (poke) {
    const spd = poke.spd;
    if (speed2pokes[spd]) {
      speed2pokes[spd].push(poke);
    }
    else {
      speed2pokes[spd] = [poke];
      speedList.push(spd);
    }
  });
  speedList.sort(function (x, y) {return x - y;});
  return [speedList, speed2pokes];
}

function calcSpeed(lv, spd, ko, ef) {
  return Math.floor(((spd + (ko == undefined ? 15 : ko)) * 2 + (ef == undefined ? 63 : ef)) * lv / 100) + 5;
}

var speedTable;
xpd.pref.speedTableBorder = 1;
xpd.pref.speedTableDetailed = true;
function createSpeedTable() {
  const pref = currentBuffer().pref;
  const [speedList, speed2pokes] = makeSpeedTableBases();
  speedTable = $d.createElement("table");
  speedTable.border = pref.speedTableBorder;
  speedTable.setAttribute("style", "empty-cells: show; float: left; background-color: inherit");
  for (let i = 0; i < speedList.length; i++) {
    const row = speedTable.insertRow(0);
    row.className = "speed-table-row" + speedList[i];
    const cell0 = row.insertCell(0);
    cell0.className = "number-cell";
    cell0.innerHTML = speedList[i];
    for (let lv = 50; lv <= 55; lv++) {
      const cell = row.insertCell(-1);
      const speed = calcSpeed(lv, speedList[i]);
      cell.className = "number-cell speed-table" + speed;
      cell.innerHTML = speed;
    }
    if (pref.speedTableDetailed) {
      const last_cell = row.insertCell(-1);
      const ary = speed2pokes[speedList[i]].map(function (x) { return x.name; });
      if (ary.length > 10) {
        last_cell.style.fontSize = "xx-small";
      }
      else if (ary.length > 10) {
        last_cell.style.fontSize = "x-small";
      }
      else if (ary.length > 8) {
        last_cell.style.fontSize = "small";
      }
      else {
        last_cell.style.fontSize = "smaller";
      }
      last_cell.innerHTML = ary.join(",");
    }
  }
  const hrow = speedTable.insertRow(0);
  hrow.appendChild($d.createElement("th"));
  for (let i = 50; i <= 55; i++) {
    let th = $d.createElement("th");
    th.innerHTML = i;
    hrow.appendChild(th);
  }
  if (pref.speedTableDetailed) {
    let th = $d.createElement("th");
    hrow.appendChild(th);
  }
}

const speedTableSheet =
    (function () {
      const element = $d.createElement('style');
      $d.getElementsByTagName('head')[0].appendChild(element);
      element.sheet.insertRule(".number-cell{text-align: right}", 0);
      return element.sheet;
    })();

function displaySpeedTable0(speed) {
  const echo = $d.getElementById("echo-area");
  echo.innerHTML = "";
  if (speed) {
    const div = $d.createElement("div");
    div.innerHTML = speed;
    div.setAttribute("style", "float: left; width: 2.5em");
    echo.appendChild(div);
  }
  echo.appendChild(speedTable);
}

xpd.pref.sameSpeedCellStyle = "color: orangered; font-weight: bold";
xpd.pref.sameSpeedRowStyle = "background-color: #ffe4e4";
function displaySpeedTable(e) {
  const number = /\d/.exec(e.target.name)[0];
  const form = getWrappedJSObject(e.target.form);
  const box = form["POKE" + number];
  const poke = pokelist[nameToIndex(box.value)];
  if (!poke) {
    throw new InvalidValueOfTextbox("種族名が不正です", box);
  }

  const lv_box = form["LV" + box.name.slice(-1)];
  const lv = parseInt(lv_box.value, 10);
  if (isNaN(lv) || lv < 1 || lv > 100) {
    throw new InvalidValueOfTextbox("Lvが不正です", lv_box);
  }
  const ko = parseInt(getId(number)[2], 16);
  const ef_box = form["EF" + number + "_3"];
  const ef = parseInt(ef_box.value, 10);
  if (isNaN(ef) || ef < 0 || ef > 63) {
    throw new InvalidValueOfTextbox("努力値が不正です", ef_box);
  }
  const speed = calcSpeed(lv, poke.spd, ko, ef);
  const speedMax = calcSpeed(55, poke.spd, ko, ef);
  const speedMin = calcSpeed(50, poke.spd, ko, ef);
  const rows = speedTable.rows;
  const partialFlag = previousCommand === xpd.commandFromFunction.get(displaySpeedTable) && displaySpeedTable.partial && displaySpeedTable.previousNumber == number;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const spd = Number(row.cells[0].innerHTML);
    if (partialFlag || calcSpeed(50, spd) <= speedMax && calcSpeed(55, spd) >= speedMin) {
      row.style.display = "";
    }
    else {
      row.style.display = "none";
    }
  }
  displaySpeedTable.partial = !partialFlag;
  displaySpeedTable.previousNumber = number;

  while (speedTableSheet.cssRules[displaySpeedTable.csslen]) {
    speedTableSheet.deleteRule(displaySpeedTable.csslen);
  }
  const pref = currentBuffer().pref;
  if (pref.sameSpeedCellStyle) {
    speedTableSheet.insertRule(`.speed-table${speed}{${pref.sameSpeedCellStyle}}`, displaySpeedTable.csslen);
  }
  if (pref.sameSpeedRowStyle) {
    speedTableSheet.insertRule(`.speed-table-row${poke.spd}{${pref.sameSpeedRowStyle}}`, displaySpeedTable.csslen);
  }

  displaySpeedTable0(speed);
}
displaySpeedTable.partial = false;
displaySpeedTable.previousNumber = null;
displaySpeedTable.csslen = speedTableSheet.cssRules.length;
interactive(displaySpeedTable, "素早さ表を表示", "form");

function globalDisplaySpeedTable(ev) {
  const rows = speedTable.rows;
  for (let i = 1; i < rows.length; i++) {
    rows[i].style.display = "";
  }
  while (speedTableSheet.cssRules[displaySpeedTable.csslen]) {
    speedTableSheet.deleteRule(displaySpeedTable.csslen);
  }
  displaySpeedTable0();
}
interactive(globalDisplaySpeedTable, "素早さ表を表示");

// --- Command:Utilities:Describe ---
function keys(obj) {
  const ary = [];
  for (const i in obj) {
    ary.push(i);
  }
  return ary;
}

function commands(pred) {
  const ary = Array.from(xpd.command.keys());
  if (pred) {
    function f(i) {
      return pred(xpd.command.get(i));
    }
    ary = ary.filter(f);
  }
  return ary.sort();
}

function makeTable(ary, header) {
  const table = $d.createElement("table");
  const th = table.createTHead();
  table.border = 1;
  table.setAttribute("style", "empty-cells: show; float: left; background-color: inherit");
  if (header) {
    const row = th.insertRow(0);
    header.forEach(function (i) {
      const cell = row.insertCell(-1);
      cell.innerHTML = i[0];
      if (currentBuffer().pref.descriptiveMode && i[1]) {
        cell.title = i[1];
      }
    });
  }
  ary.forEach(function (a) {
    const row = table.insertRow(-1);
    a.forEach(function (i) {
      row.insertCell(-1).innerHTML = i;
    });
  });
  return table;
}

var command2keybind = null;
var keybind2command = null;
function updateKeybindCache() {
  command2keybind = {};
  keybind2command = {};
  function f(keymap, prefix) {
    for (let [key, val] of keymap) {
      if (val instanceof Keymap) {
        f(val, prefix + " " + key);
      }
      else {
        if (!val.name) {
          throw new ImplementationError(key + ": " + val);
        }
        if (!command2keybind[val.name]) {
          command2keybind[val.name] = [];
        }
        const keyString = prefix + " " + key;
        keybind2command[keyString] = val.name;
        command2keybind[val.name].push(keyString);
      }
    }
  }
  f(formKeymap, "");
  f(documentKeymap, "");
}

function commandToKeybind(i) {
  return command2keybind[i];
}

function keybindToCommand(i) {
  return keybind2command[i];
}

xpd.pref.describeFormats = {
  commandName: [["コマンド名"], function (name, _) { return name; }],
  document: [["説明", "詳細は xpd wiki を参照してください"], function (_, command) { return command.document ?? "<small style=\"color: gray\">(undocumented)</small>"; }],
  keybind: [["キーバインド", "キーバインドがあるコマンドは、キーでコマンドを実行することができます"], function (_, command) {
    const a = commandToKeybind(command.name);
    return a ? (a.length > 4 ? a.slice(0, 4).concat("...") : a).join(", ") : "";
  }],
  global: [["Global", "Global Command はフォームの外でも実行することができます"], function (_, command) { return command.scope === "document" ? "○" : ""; }]
};

function describeCommand0(format_ary, pred) {
  const format = [];
  const header = [];
  const t = currentBuffer().pref.describeFormats;
  updateKeybindCache();
  format_ary.forEach(function (i) {
    const s = t[i];
    format.push(s[1]);
    header.push(s[0]);
  });
  message(makeTable(commands(pred).map(function (name) {
    const res = [];
    for (const f of format) {
      res.push(f(name, xpd.command.get(name)));
    }
    return res;
  }),
                    header));
}

function describeAllCommand(e) {
  describeCommand0(keys(currentBuffer().pref.describeFormats));
}
interactive(describeAllCommand, "コマンド一覧を表示");

// Command:Utilities:Snapshots

const snapshotPrefix = "xpd-snapshot-";
const snapshotNamesKey = "xpd-snapshots";

async function snapshot() {
  const name = prompt("snapshot: snapshot name");
  if (!name) {
    return;
  }
  const fullName = snapshotPrefix + name;
  if (await GM.getValue(fullName)) {
    if (!confirm("上書きしますか？")) {
      return;
    }
  }
  const a = (await GM.getValue(snapshotNamesKey, "")).split("\n");
  a.push(name);
  await GM.setValue(snapshotNamesKey, a.sort().join("\n"));
  await GM.setValue(fullName, $d.cookie);
  message("snapshot `" + name + "'");
}

interactive(snapshot, "スナップショットをとる");

async function restoreSnapshot() {
  const name = prompt("restore-snapshot: snapshot name");
  if (!name) {
    return;
  }
  const fullName = snapshotPrefix + name;
  const value = await GM.getValue(fullName);
  if (value) {
    extendCookiesDeadline(value);
    quit();
  }
  else {
    message("snapshot `" + name + "' doesn't exist");
  }
}

interactive(restoreSnapshot, "スナップショットを復元");

async function removeSnapshot() {
  const name = prompt("delete-snapshot: snapshot name");
  if (!name) {
    return;
  }
  const fullName = snapshotPrefix + name;
  const snapshotNames = (await GM.getValue(snapshotNamesKey, "")).split("\n");
  const index = snapshotNames.indexOf(name);
  if (index >= 0) {
    snapshotNames.splice(index, 1);
    await GM.setValue(snapshotNamesKey, snapshotNames.join("\n"));
    await GM.setValue(snapshotPrefix + name, "");
    message("delete snapshot `" + name + "'");
  }
  else {
    message("snapshot `" + name + "' doesn't exist");
  }
}

interactive(removeSnapshot, "スナップショットを削除");

async function listSnapshots() {
  const names = await GM.getValue(snapshotNamesKey);
  if (names) {
    message(names.split("\n").join("<br />"));
  }
  else {
    message("no snapshots");
  }
}
interactive(listSnapshots, "スナップショット一覧");

// Command:Utilities:Others

const generateId = (
  function () {
    const base = "generatedId";
    let seed = 0;
    return function () {
      return base + (seed++);
    };
  })();

xpd.pref.partyBoxURL = "http://www.q9con.net/pokemon/PartyBox/convert.php";
function openInPartyBox() {
  setPoke();
  open(currentBuffer().pref.partyBoxURL + "?pd=1_x_" + getPD(), "partybox_" + generateId());
}
interactive(openInPartyBox, "パーティをParty Boxで開く");

function writeRebuildForm() {
  setPoke();
  messageWithTextbox('<form action="http://psense.lib.net/_/PDINPUT.cgi" method="post"><input type="hidden" name="ACTION" value="RECEPT"><input type="hidden" name="C" value="1_x_' + getPD() + '"><input type="submit" value="再現"></form>');
}
interactive(writeRebuildForm, "HTMLの再現フォームを表示");

function writeRebuildJSCode() {
  setPoke();
  messageWithTextbox('javascript:void(document.forms[0].PD.value="' + getPD() + '");');
}
interactive(writeRebuildJSCode);

function markSwapingCheckbox(e) {
  if (isMinibuffer(e.target)) {
    return true;
  }
  else {
    getWrappedJSObject(e.target.form)["swap" + getLineNumber(e.target)].click();
    return false;
  }
}
interactive(markSwapingCheckbox, "ポケモンの並び替え", "form");

/*unfocus*/
function unfocus(e) {
  e.target.blur();
}
interactive(unfocus, "フォーカスを外す");

/*help*/
function help(e) {
  message(help.string);
}
help.string = '<p><a href="http://o-s.sub.jp/xpd/" target="_blank">xpd wiki</a></p>';
interactive(help);

// --- Utilities ---
// --- Utilities:Version
xpd.pref.versionFormat = /^(\d+)\.(\d+)\.(\d+)(?:-([A-Za-z].*))?/;
function versionLessThan(v1, v2) {
  const re = currentBuffer().pref.versionFormat;
  const [ma1, ma2] = [v1, v2].map(v => re.exec(v));

  for (let i = 1; i < 4; i++) {
    if (ma1[i] < ma2[i]) {
      return true;
    }
    else if (ma1[i] > ma2[i]) {
      return false;
    }
  }
  if (ma1[4] != undefined) {
    if (ma2[4] == undefined) {
      return true;
    }
    else {
      return ma1[4] < ma2[4];
    }
  }
  else {
    return false;
  }
}

xpd.pref.latestVersionURL = "http://o-s.sub.jp/xpd/index.php?plugin=attach&pcmd=open&file=latest-version.txt&refer=misc";
function checkLatestVersion() {
  const pref = currentBuffer().pref;
  message("最新バージョン情報を取得しています...");
  GM.xmlHttpRequest(
    {
      method: "GET",
      url: pref.latestVersionURL,
      onload: function (response) {
        const ma = pref.versionFormat.exec(response.responseText);
        if (ma && response.status == 200) {
          if (versionLessThan(xpd.version, ma[0])) {
            messageText("xpd" + ma[0] + "がリリースされています。\n" +
                        "現在お使いのバージョンは" + xpd.version + "です。");
          }
          else {
            message("");
          }
        }
        else {
          handleInteractiveError(new BadHTTPResponse("最新バージョン情報の取得に失敗しました", response));
        }
      }
    }
  );
}

// --- Aggressive Keybind Mode ---
var systemCommandMap = new Keymap("C-x");
xpd.pref.aggressiveKeybindMode = true;
function _aggressiveKeybindMode(on) {
  const k = systemCommandMap.name;
  on ? documentKeymap.define(k, systemCommandMap) : documentKeymap.remove(k);
}
const aggressiveKeybindMode = defineMode(_aggressiveKeybindMode, "AK");

// --- Keymap Definition ---
function initializeKeymap() {
  formKeymap.define("Tab", completeForTabCommand);
  formKeymap.define("S-Tab", completeForTabCommand2);
  formKeymap.define("Space", completeCommand);
  formKeymap.define("C-i", completeForTabCommand);
  formKeymap.define("C-n", nextLine);
  formKeymap.define("C-p", previousLine);
  formKeymap.define("A-k", killLine);
  formKeymap.define("A-f", forwardTextbox);
  formKeymap.define("A-b", backwardTextbox);
  formKeymap.define("A-t", transposeMoves);
  formKeymap.define("C-o", switchBlock);
  formKeymap.define("A-a", beginningOfLine);
  formKeymap.define("C-j", beginningOfNextLine);
  formKeymap.define("C-I", completeForTabCommand2);
  formKeymap.define("@", markSwapingCheckbox);

  documentKeymap.define("C-,", previousBuffer);
  documentKeymap.define("C-.", nextBuffer);

  const globalSetLevelMap = documentKeymap.makeSubKeymap("C-l", "global-set-level");

  globalSetLevelMap.define("C-t", toggleLevelAll);

  const setLevelMap = formKeymap.makeSubKeymap("C-l", "local-set-level", globalSetLevelMap);
  const setLevelAllMap = globalSetLevelMap.makeSubKeymap("C-a", "set-level-globally");
  for (let i = 0; i < 10; i++) {
    setLevelMap.define(String(i), setLevel);
    setLevelAllMap.define(String(i), setLevelAll);
  }
  setLevelMap.define("-", setLevelFromPrompt);
  setLevelAllMap.define("-", setLevelAllFromPrompt);

  documentKeymap.define("A-x", displayMinibuffer);
  documentKeymap.define("C-g", quitCommand);

  formKeymap.define("C-m", executeCommand);
  formKeymap.define("Enter", executeCommand);

  formKeymap.define("C-s", displaySpeedTable);
  documentKeymap.define("C-s", globalDisplaySpeedTable);

  systemCommandMap.define("C-s", save);
  systemCommandMap.define("C-c", quit);
  systemCommandMap.define("C-k", clearAll);
  systemCommandMap.define("C-n", newParty);
  systemCommandMap.define("C-w", writeParty);
  systemCommandMap.define("C-u", unfocus);
  systemCommandMap.define("C-f", findParty);
  systemCommandMap.define("C-v", findAlternateParty);
  systemCommandMap.define("C-d", listParties);
  systemCommandMap.define("b", switchToBuffer);
  systemCommandMap.define("C-b", listBuffers);
  systemCommandMap.define("k", killCurrentBuffer);
  systemCommandMap.define("C-r", revert);
  systemCommandMap.define("i", importPD);
  systemCommandMap.define("e", exportPD);
}

// --- Initialize ---
xpd.pref.formSizeEconomyMode = true;

function initialize() {
  try {
    createEchoArea();
  }
  catch (e) {
    alert("初期化中にエラーが発生しました\n" + e);
    return;
  }
  try {
    initialBuffer(getNumber(), initLoadParty());

    stripTableHeader();
    currentBuffer().pref.formSizeEconomyMode && fixFormSizes();
    setTableStyleNowrap();

    documentKeymapObserver = documentKeymap.observe("keydown", $d);
    formKeymapObserver = formKeymap.observe("keydown", $f);

    setInputs();
    setButtons();

    createEffortColumn();
    createHiddenpowerColumn();
    createHPColumn();
    createSexColumn();
    createSwapCheckBox();
    initializeTextboxIndexes();

    createMiniBuffer();
    createModeLine();

    setOnChange();
    setStatus();
    setHiddenpower();

    createSpeedTable();
    initializeKeymap();
    currentBuffer().pref.autoCompleteMode && initializeAutoCompleteMode();

    initializeBackButton();

    extendCookiesDeadline();

    for (const f of initializeHooks) {
      f();
    }
    drawModeLine();
    checkLatestVersion();
  } catch (e) {
    alert("初期化中にエラーが発生しました");
    handleInteractiveError(e);
  }
}

initialize();
