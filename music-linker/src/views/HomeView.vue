<template>
    <div style="flex-direction: row;">
        <div style="flex-direction: column; width: 50%;">
            <img src="@/assets/logo_withbrand.png"/>
            <h2>连接所有音乐</h2>
            <div style="height: 10%;"/>
            <button class="main-start-button" @click="$router.push('/login')">
                <p style="font-size: 28px; translate: 0px -2px;">立即体验</p>
            </button>
        </div>
        <div style="flex-direction: column; width: 50%; padding: 0;">
                <p>使用Vite构建，完全开源，快速安全。开源仓库：<br/><a href="https://github.com/HanaChan233/MusicLinker">https://github.com/HanaChan233/MusicLinker</a></p>
                <div style="font-size: 32px; height: 2em;"/>
                <p>兼容多种市面常见流媒体平台，更支持本地音频。<br/>流媒体<sup>1</sup>、本地文件<sup>2</sup>或网盘<sup>3</sup>，全都支持。</p>
                <div style="font-size: 32px; height: 2em;"/>
                <p>支持导入外部歌单<sup>4</sup>或收藏夹<sup>5</sup>。无需重复配置，<br/>快速切换至 MusicLinker。</p>
                <div style="font-size: 32px; height: 2em;"/>

                <p style="font-size: 12px">1: 支持平台：哔哩哔哩、YouTube、网易云音乐、QQ 音乐。可能需要账号 Token 以获取歌曲，取决于具体平台。<br/>可能需要会员账号 Token 以获取会员音乐。部分版权受限音乐可能无法获取。</p>
                <p style="font-size: 12px">2: 支持在部署本服务后端的设备上读取歌曲作为数据源。需要提供相应权限。</p>
                <p style="font-size: 12px">3: 兼容 Alist API。需手动部署 Alist 或其改版，且需手动维护 Alist 与网盘的支持关系。</p>
                <p style="font-size: 12px">4: 支持平台：QQ 音乐。支持平台不断更新中。</p>
                <p style="font-size: 12px">5: 支持平台：哔哩哔哩。可能需要账号 Token 以读取收藏夹。支持平台不断更新中。</p>
        </div>

    </div>
</template>

<style scoped>
img {
    width: 400px;
}
h1 {
    color: white;
    font-size: 64px;
}
h2 {
    font-size: 40px;
}
div {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
}
p {
    font-size: 32px;
}


.main-start-button {
    width: 200px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 2px solid var(--color-border);
    border-radius: 30px;
    color: #9f9f9f;
    transition: 0.3s all;
}
.main-start-button:hover {
    background-color: #9f9f9f;
    color: #333333;
}
</style>