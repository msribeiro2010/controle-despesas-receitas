
import AppLayout from "@/components/layouts/AppLayout";
import SettingsForm from "@/components/settings/SettingsForm";

const Settings = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Configurações</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas configurações financeiras e preferências.
        </p>
      </div>
      
      <SettingsForm />
    </AppLayout>
  );
};

export default Settings;
