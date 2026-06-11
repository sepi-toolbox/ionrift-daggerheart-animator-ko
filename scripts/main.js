import { handleAnimation } from "./animationBridge.js";
import { AnimatorDiagnostics } from "./Diagnostics.js";

// Register settings during init (before ready)
Hooks.once('init', () => {
    // v14: FormApplication(V1) 전역이 제거됨 → ApplicationV2 우선, v12~v13 폴백 유지.
    // 이 메뉴는 실제 폼을 렌더하지 않고 Discord 링크만 새 탭으로 여는 용도.
    const SupportAppBase = foundry.applications?.api?.ApplicationV2 ?? FormApplication;
    class IonriftSupportLink extends SupportAppBase {
        render() {
            window.open("https://discord.gg/vFGXf7Fncj", "_blank");
            return this;
        }
    }

    // Support Link
    game.settings.registerMenu("ionrift-daggerheart-animator", "supportLink", {
        name: "지원 받기",
        label: "Discord 참여",
        hint: "버그 신고, 질문, 기능 요청.",
        icon: "fab fa-discord",
        type: IonriftSupportLink,
        restricted: false
    });
});

Hooks.once('ready', async function () {
    console.log("Ionrift Animations | Module Ready");

    // Quick startup check
    const aa = game.modules.get("autoanimations");
    if (aa?.active) {
        console.log(`Ionrift Animations | Readiness Check: Automated Animations v${aa.version} ACTIVE ✅`);
    } else {
        ui.notifications.error("Ionrift Animations에는 'Automated Animations' 모듈이 필요합니다!");
        console.error("Ionrift Animations | Readiness Check: Automated Animations MISSING or INACTIVE ❌");
    }
});

Hooks.on("chatMessage", (chatLog, message, chatData) => {
    if (message.trim() === "/ionanim debug") {
        AnimatorDiagnostics.run();
        return false;
    }
});

Hooks.on("createChatMessage", (message) => {
    // Detect if it's a roll
    if (!message.isRoll && !message.rolls?.length) return;

    // Log hook entry for debugging
    console.log("Ionrift Animations | Hook detected. Analyzing roll...");

    const roll = message.rolls[0];

    // Extract Item Name from Roll Options (e.g. "Unleash Chaos: Cast")
    let itemName = "Generic";
    if (roll.options && roll.options.title) {
        itemName = roll.options.title.split(":")[0].trim();
    } else if (roll.data && roll.data.name) {
        itemName = roll.data.name; // Fallback
    }

    // Also try to get the Actor Name for Adversary lookups
    const speakerId = message.speaker?.actor;
    let actor = null;
    if (speakerId) {
        actor = game.actors.get(speakerId);
    }

    if (actor) {
        // Fire animation async
        handleAnimation(itemName, actor, message).catch(err =>
            console.error("Ionrift Animations | Animation Error", err)
        );
    }
});
