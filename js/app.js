import { GymModel } from './model.js';
import { GymView } from './view.js';
import { GymController } from './controller.js';

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const model = new GymModel();
  const view = new GymView();
  const controller = new GymController(model, view);

  // Expose model/view/controller to window for debug purposes if needed
  window.GymApp = { model, view, controller };
});
