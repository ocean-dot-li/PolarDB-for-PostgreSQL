import{_ as r,M as l,p as c,q as d,R as s,t as n,N as a,V as o,a1 as p}from"./framework-de73eade.js";const m={},v=s("h1",{id:"定制开发环境",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#定制开发环境","aria-hidden":"true"},"#"),n(" 定制开发环境")],-1),u=s("h2",{id:"自行构建开发镜像",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#自行构建开发镜像","aria-hidden":"true"},"#"),n(" 自行构建开发镜像")],-1),b={href:"https://hub.docker.com/r/polardb/polardb_pg_devel/tags",target:"_blank",rel:"noopener noreferrer"},k=s("code",null,"polardb/polardb_pg_devel",-1),g=p(`<p>另外，我们也提供了构建上述开发镜像的 Dockerfile，从 CentOS 7 官方镜像 <code>centos:centos7</code> 开始构建出一个安装完所有开发和运行时依赖的镜像。您可以根据自己的需要在 Dockerfile 中添加更多依赖。以下是手动构建镜像的 Dockerfile 及方法。</p><details class="custom-container details"><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> centos:centos7</span>

<span class="token instruction"><span class="token keyword">CMD</span> bash</span>

<span class="token comment"># avoid missing locale problem</span>
<span class="token instruction"><span class="token keyword">RUN</span> sed -i <span class="token string">&#39;s/override_install_langs/# &amp;/&#39;</span> /etc/yum.conf</span>

<span class="token comment"># add EPEL and scl source</span>
<span class="token instruction"><span class="token keyword">RUN</span> rpmkeys --import file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7 &amp;&amp; <span class="token operator">\\</span>
    yum install -y epel-release centos-release-scl &amp;&amp; <span class="token operator">\\</span>
    rpmkeys --import file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7 &amp;&amp; <span class="token operator">\\</span>
    rpmkeys --import file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo &amp;&amp; <span class="token operator">\\</span>
    yum update -y</span>

<span class="token comment"># GCC and LLVM</span>
<span class="token instruction"><span class="token keyword">RUN</span> yum install -y devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-gdb devtoolset-9-libstdc++-devel devtoolset-9-make &amp;&amp; <span class="token operator">\\</span>
    yum install -y llvm-toolset-7.0-llvm-devel llvm-toolset-7.0-clang-devel llvm-toolset-7.0-cmake</span>

<span class="token comment"># dependencies</span>
<span class="token instruction"><span class="token keyword">RUN</span> yum install -y libicu-devel pam-devel readline-devel libxml2-devel libxslt-devel openldap-devel openldap-clients openldap-servers libuuid-devel xerces-c-devel bison flex gettext tcl-devel python-devel perl-IPC-Run perl-Expect perl-Test-Simple perl-DBD-Pg perl-ExtUtils-Embed perl-ExtUtils-MakeMaker zlib-devel krb5-devel krb5-workstation krb5-server protobuf-devel &amp;&amp; <span class="token operator">\\</span>
    ln /usr/lib64/perl5/CORE/libperl.so /usr/lib64/libperl.so</span>

<span class="token comment"># install basic tools</span>
<span class="token instruction"><span class="token keyword">RUN</span> echo <span class="token string">&quot;install basic tools&quot;</span> &amp;&amp; <span class="token operator">\\</span>
    yum install -y <span class="token operator">\\</span>
        git lcov psmisc sudo vim <span class="token operator">\\</span>
        less  <span class="token operator">\\</span>
        net-tools  <span class="token operator">\\</span>
        python2-psycopg2 <span class="token operator">\\</span>
        python2-requests  <span class="token operator">\\</span>
        tar  <span class="token operator">\\</span>
        shadow-utils <span class="token operator">\\</span>
        which  <span class="token operator">\\</span>
        binutils<span class="token operator">\\</span>
        libtool <span class="token operator">\\</span>
        perf  <span class="token operator">\\</span>
        make sudo <span class="token operator">\\</span>
        util-linux</span>

<span class="token comment"># set to empty if GitHub is not barriered</span>
<span class="token comment"># ENV GITHUB_PROXY=https://ghproxy.com/</span>
<span class="token instruction"><span class="token keyword">ENV</span> GITHUB_PROXY=</span>

<span class="token instruction"><span class="token keyword">ENV</span> OPENSSL_VERSION=OpenSSL_1_1_1k</span>

<span class="token comment"># install dependencies from GitHub mirror</span>
<span class="token instruction"><span class="token keyword">RUN</span> yum install -y libaio-devel wget &amp;&amp; <span class="token operator">\\</span>
    cd /usr/local &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># zlog for PFSD</span>
    wget --no-verbose --no-check-certificate <span class="token string">&quot;\${GITHUB_PROXY}https://github.com/HardySimpson/zlog/archive/refs/tags/1.2.14.tar.gz&quot;</span> &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># PFSD</span>
    wget --no-verbose --no-check-certificate <span class="token string">&quot;\${GITHUB_PROXY}https://github.com/ApsaraDB/PolarDB-FileSystem/archive/refs/tags/pfsd4pg-release-1.2.41-20211018.tar.gz&quot;</span> &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># OpenSSL 1.1.1</span>
    wget --no-verbose --no-check-certificate <span class="token string">&quot;\${GITHUB_PROXY}https://github.com/openssl/openssl/archive/refs/tags/\${OPENSSL_VERSION}.tar.gz&quot;</span> &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># enable build tools</span>
    echo <span class="token string">&quot;source /opt/rh/devtoolset-9/enable&quot;</span> &gt;&gt; /etc/bashrc &amp;&amp; <span class="token operator">\\</span>
    echo <span class="token string">&quot;source /opt/rh/llvm-toolset-7.0/enable&quot;</span> &gt;&gt; /etc/bashrc &amp;&amp; <span class="token operator">\\</span>
    source /etc/bashrc &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># unzip and install zlog</span>
    tar -zxf 1.2.14.tar.gz &amp;&amp; <span class="token operator">\\</span>
    cd zlog-1.2.14 &amp;&amp; <span class="token operator">\\</span>
    make &amp;&amp; make install &amp;&amp; <span class="token operator">\\</span>
    echo <span class="token string">&#39;/usr/local/lib&#39;</span> &gt;&gt; /etc/ld.so.conf &amp;&amp; ldconfig &amp;&amp; <span class="token operator">\\</span>
    cd .. &amp;&amp; <span class="token operator">\\</span>
    rm 1.2.14.tar.gz &amp;&amp; <span class="token operator">\\</span>
    rm -rf zlog-1.2.14 &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># unzip and install PFSD</span>
    tar -zxf pfsd4pg-release-1.2.41-20211018.tar.gz &amp;&amp; <span class="token operator">\\</span>
    cd PolarDB-FileSystem-pfsd4pg-release-1.2.41-20211018 &amp;&amp; <span class="token operator">\\</span>
    ./autobuild.sh &amp;&amp; ./install.sh &amp;&amp; <span class="token operator">\\</span>
    cd .. &amp;&amp; <span class="token operator">\\</span>
    rm pfsd4pg-release-1.2.41-20211018.tar.gz &amp;&amp; <span class="token operator">\\</span>
    rm -rf PolarDB-FileSystem-pfsd4pg-release-1.2.41-20211018 &amp;&amp; <span class="token operator">\\</span>
    <span class="token comment"># unzip and install OpenSSL 1.1.1</span>
    tar -zxf <span class="token variable">$OPENSSL_VERSION</span>.tar.gz &amp;&amp; <span class="token operator">\\</span>
    cd /usr/local/openssl-<span class="token variable">$OPENSSL_VERSION</span> &amp;&amp; <span class="token operator">\\</span>
    ./config --prefix=/usr/local/openssl &amp;&amp; make -j64 &amp;&amp; make install &amp;&amp; <span class="token operator">\\</span>
    cp /usr/local/openssl/lib/libcrypto.so.1.1 /usr/lib64/ &amp;&amp; <span class="token operator">\\</span>
    cp /usr/local/openssl/lib/libssl.so.1.1 /usr/lib64/ &amp;&amp; <span class="token operator">\\</span>
    cp -r /usr/local/openssl/include/openssl /usr/include/ &amp;&amp; <span class="token operator">\\</span>
    ln -sf /usr/lib64/libcrypto.so.1.1 /usr/lib64/libcrypto.so &amp;&amp; <span class="token operator">\\</span>
    ln -sf /usr/lib64/libssl.so.1.1 /usr/lib64/libssl.so &amp;&amp; <span class="token operator">\\</span>
    rm -f /usr/local/<span class="token variable">$OPENSSL_VERSION</span>.tar.gz &amp;&amp; <span class="token operator">\\</span>
    rm -rf /usr/local/openssl-<span class="token variable">$OPENSSL_VERSION</span></span>

<span class="token comment"># create default user</span>
<span class="token instruction"><span class="token keyword">ENV</span> USER_NAME=postgres</span>
<span class="token instruction"><span class="token keyword">RUN</span> echo <span class="token string">&quot;create default user&quot;</span> &amp;&amp; <span class="token operator">\\</span>
    groupadd -r <span class="token variable">$USER_NAME</span> &amp;&amp; useradd -g <span class="token variable">$USER_NAME</span> <span class="token variable">$USER_NAME</span> -p <span class="token string">&#39;&#39;</span> &amp;&amp; <span class="token operator">\\</span>
    usermod -aG wheel <span class="token variable">$USER_NAME</span></span>

<span class="token instruction"><span class="token keyword">WORKDIR</span> /home/<span class="token variable">$USER_NAME</span></span>

<span class="token comment"># modify conf</span>
<span class="token instruction"><span class="token keyword">RUN</span> echo <span class="token string">&quot;modify conf&quot;</span> &amp;&amp; <span class="token operator">\\</span>
    mkdir -p /run/pfs &amp;&amp; chown <span class="token variable">$USER_NAME</span> /run/pfs &amp;&amp; <span class="token operator">\\</span>
    mkdir -p /var/log/pfs &amp;&amp; chown <span class="token variable">$USER_NAME</span> /var/log/pfs &amp;&amp; <span class="token operator">\\</span>
    echo <span class="token string">&quot;ulimit -c unlimited&quot;</span> &gt;&gt; /home/postgres/.bashrc &amp;&amp; <span class="token operator">\\</span>
    echo <span class="token string">&quot;export PATH=/home/postgres/tmp_basedir_polardb_pg_1100_bld/bin:\\$PATH&quot;</span> &gt;&gt; /home/postgres/.bashrc &amp;&amp; <span class="token operator">\\</span>
    echo <span class="token string">&quot;alias pg=&#39;psql -h /home/postgres/tmp_master_dir_polardb_pg_1100_bld/&#39;&quot;</span> &gt;&gt; /home/postgres/.bashrc &amp;&amp; <span class="token operator">\\</span>
    rm /etc/localtime &amp;&amp; <span class="token operator">\\</span>
    cp /usr/share/zoneinfo/UTC /etc/localtime &amp;&amp; <span class="token operator">\\</span>
    sed -i <span class="token string">&#39;s/4096/unlimited/g&#39;</span> /etc/security/limits.d/20-nproc.conf &amp;&amp; <span class="token operator">\\</span>
    sed -i <span class="token string">&#39;s/vim/vi/g&#39;</span> /root/.bashrc</span>

<span class="token instruction"><span class="token keyword">USER</span> <span class="token variable">$USER_NAME</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details><p>将上述内容复制到一个文件内（假设文件名为 <code>Dockerfile-PolarDB</code>）后，使用如下命令构建镜像：</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>💡 请在下面的高亮行中按需替换 <code>&lt;image_name&gt;</code> 内的 Docker 镜像名称</p></div><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> build <span class="token parameter variable">--network</span><span class="token operator">=</span>host <span class="token punctuation">\\</span>
    <span class="token parameter variable">-t</span> <span class="token operator">&lt;</span>image_name<span class="token operator">&gt;</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-f</span> Dockerfile-PolarDB <span class="token builtin class-name">.</span>
</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><br></div></div><h2 id="从干净的系统开始搭建开发环境" tabindex="-1"><a class="header-anchor" href="#从干净的系统开始搭建开发环境" aria-hidden="true">#</a> 从干净的系统开始搭建开发环境</h2><p>该方式假设您从一台具有 root 权限的干净的 CentOS 7 操作系统上从零开始，可以是：</p><ul><li>安装 CentOS 7 的物理机/虚拟机</li><li>从 CentOS 7 官方 Docker 镜像 <code>centos:centos7</code> 上启动的 Docker 容器</li></ul><h3 id="建立非-root-用户" tabindex="-1"><a class="header-anchor" href="#建立非-root-用户" aria-hidden="true">#</a> 建立非 root 用户</h3><p>PolarDB for PostgreSQL 需要以非 root 用户运行。以下步骤能够帮助您创建一个名为 <code>postgres</code> 的用户组和一个名为 <code>postgres</code> 的用户。</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>如果您已经有了一个非 root 用户，但名称不是 <code>postgres:postgres</code>，可以忽略该步骤；但请注意在后续示例步骤中将命令中用户相关的信息替换为您自己的用户组名与用户名。</p></div><p>下面的命令能够创建用户组 <code>postgres</code> 和用户 <code>postgres</code>，并为该用户赋予 sudo 和工作目录的权限。需要以 root 用户执行这些命令。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># install sudo</span>
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">sudo</span>
<span class="token comment"># create user and group</span>
<span class="token function">groupadd</span> <span class="token parameter variable">-r</span> postgres
<span class="token function">useradd</span> <span class="token parameter variable">-m</span> <span class="token parameter variable">-g</span> postgres postgres <span class="token parameter variable">-p</span> <span class="token string">&#39;&#39;</span>
<span class="token function">usermod</span> <span class="token parameter variable">-aG</span> wheel postgres
<span class="token comment"># make postgres as sudoer</span>
<span class="token function">chmod</span> u+w /etc/sudoers
<span class="token builtin class-name">echo</span> <span class="token string">&#39;postgres ALL=(ALL) NOPASSWD: ALL&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/sudoers
<span class="token function">chmod</span> u-w /etc/sudoers
<span class="token comment"># grant access to home directory</span>
<span class="token function">chown</span> <span class="token parameter variable">-R</span> postgres:postgres /home/postgres/
<span class="token builtin class-name">echo</span> <span class="token string">&#39;source /etc/bashrc&#39;</span> <span class="token operator">&gt;&gt;</span> /home/postgres/.bashrc
<span class="token comment"># for su postgres</span>
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/4096/unlimited/g&#39;</span> /etc/security/limits.d/20-nproc.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，切换到 <code>postgres</code> 用户，就可以进行后续的步骤了：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">su</span> postgres
<span class="token builtin class-name">source</span> /etc/bashrc
<span class="token builtin class-name">cd</span> ~
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="依赖安装" tabindex="-1"><a class="header-anchor" href="#依赖安装" aria-hidden="true">#</a> 依赖安装</h3><p>在 PolarDB for PostgreSQL 的源码库根目录下，有一个 <code>install_dependencies.sh</code> 脚本，包含了 PolarDB 和 PFS 需要运行的所有依赖。因此，首先需要克隆 PolarDB 的源码库。</p>`,17),h={href:"https://github.com/ApsaraDB/PolarDB-for-PostgreSQL",target:"_blank",rel:"noopener noreferrer"},f=s("code",null,"POLARDB_11_STABLE",-1),_={href:"https://gitee.com/mirrors/PolarDB-for-PostgreSQL",target:"_blank",rel:"noopener noreferrer"},S=s("div",{class:"language-bash","data-ext":"sh"},[s("pre",{class:"language-bash"},[s("code",null,[s("span",{class:"token function"},"sudo"),n(" yum "),s("span",{class:"token function"},"install"),n(),s("span",{class:"token parameter variable"},"-y"),n(),s("span",{class:"token function"},"git"),n(`
`),s("span",{class:"token function"},"git"),n(" clone "),s("span",{class:"token parameter variable"},"-b"),n(` POLARDB_11_STABLE https://github.com/ApsaraDB/PolarDB-for-PostgreSQL.git
`)])])],-1),y=s("div",{class:"language-bash","data-ext":"sh"},[s("pre",{class:"language-bash"},[s("code",null,[s("span",{class:"token function"},"sudo"),n(" yum "),s("span",{class:"token function"},"install"),n(),s("span",{class:"token parameter variable"},"-y"),n(),s("span",{class:"token function"},"git"),n(`
`),s("span",{class:"token function"},"git"),n(" clone "),s("span",{class:"token parameter variable"},"-b"),n(` POLARDB_11_STABLE https://gitee.com/mirrors/PolarDB-for-PostgreSQL
`)])])],-1),P=p(`<p>源码下载完毕后，使用 <code>sudo</code> 执行源代码根目录下的依赖安装脚本 <code>install_dependencies.sh</code> 自动完成所有的依赖安装。如果有定制的开发需求，请自行修改 <code>install_dependencies.sh</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> PolarDB-for-PostgreSQL
<span class="token function">sudo</span> ./install_dependencies.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function E(R,D){const e=l("ExternalLinkIcon"),t=l("CodeGroupItem"),i=l("CodeGroup");return c(),d("div",null,[v,u,s("p",null,[n("我们在 DockerHub 上提供了构建完毕的镜像 "),s("a",b,[k,a(e)]),n(" 可供直接使用（支持 AMD64 和 ARM64 架构）😁。")]),g,s("p",null,[n("PolarDB for PostgreSQL 的代码托管于 "),s("a",h,[n("GitHub"),a(e)]),n(" 上，稳定分支为 "),f,n("。如果因网络原因不能稳定访问 GitHub，则可以访问 "),s("a",_,[n("Gitee 国内镜像"),a(e)]),n("。")]),a(i,null,{default:o(()=>[a(t,{title:"GitHub"},{default:o(()=>[S]),_:1}),a(t,{title:"Gitee 国内镜像"},{default:o(()=>[y]),_:1})]),_:1}),P])}const L=r(m,[["render",E],["__file","customize-dev-env.html.vue"]]);export{L as default};
