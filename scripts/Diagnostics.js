export class AnimatorDiagnostics {
    static run() {
        console.log("Ionrift Animations | Running Diagnostics...");
        let status = [];

        // 1. Dependency Check
        const aaModule = game.modules.get("autoanimations");
        if (aaModule && aaModule.active) {
            status.push(`✅ Automated Animations 활성 (v${aaModule.version})`);
        } else {
            status.push(`❌ Automated Animations 없음 또는 비활성`);
        }

        // 2. API Check
        if (typeof AutomatedAnimations !== "undefined" && typeof AutomatedAnimations.playAnimation === "function") {
            status.push(`✅ API 'AutomatedAnimations.playAnimation' 발견됨`);
        } else {
            status.push(`❌ API 'AutomatedAnimations.playAnimation' 찾을 수 없음`);
        }

        // 3. Output
        const msg = `<h3>Ionrift Animator 진단</h3><ul>${status.map(s => `<li>${s}</li>`).join("")}</ul>`;
        ChatMessage.create({ content: msg, speaker: { alias: "Ionrift Debug" } });
        console.log(status);
    }
}
